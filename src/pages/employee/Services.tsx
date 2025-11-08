import Sidebar from "../../components/Sidebar";
import { useMemo, useState, useEffect } from "react";
import { fetchServices, deleteService, updateService } from "../../api/services";
import type { ServiceDto } from "../../api/services";
import { fetchAppointmentServices } from "../../api/appointmentServices";
import type { AppointmentServiceDto } from "../../api/appointmentServices";
import { updateAppointmentStatus } from "../../api/appointments";
import { useToast } from '../../components/ToastProvider';

// No local dummy data: use backend catalog and appointment-services

export default function Services() {
  const toast = useToast();
  const [catalog, setCatalog] = useState<ServiceDto[] | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [appointmentServices, setAppointmentServices] = useState<AppointmentServiceDto[] | null>(null);
  const [loadingAppointmentServices, setLoadingAppointmentServices] = useState(false);
  const [appointmentServicesError, setAppointmentServicesError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentServiceDto | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceDto>>({});
  const [savingServiceId, setSavingServiceId] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [apptStatusFilter, setApptStatusFilter] = useState<string>("All");
  const [apptOptionFilter, setApptOptionFilter] = useState<string>("All");

  // local service list removed; backend appointmentServices drive the UI

  // loader for appointment services so we can reuse (retry)
  const loadAppointmentServices = async () => {
    setAppointmentServicesError(null);
    setLoadingAppointmentServices(true);
    try {
      const data = await fetchAppointmentServices();
      setAppointmentServices(data ?? []);
    } catch (err: any) {
      setAppointmentServicesError(err?.message || 'Failed to load appointment services');
      setAppointmentServices(null);
    } finally {
      setLoadingAppointmentServices(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingCatalog(true);
      try {
        const data = await fetchServices();
        if (!mounted) return;
        setCatalog(data);
      } catch (err: any) {
        if (!mounted) return;
        setCatalogError(err?.message || 'Failed to load services');
      } finally {
        if (!mounted) return;
        setLoadingCatalog(false);
      }
    };

    load();
    void loadAppointmentServices();
    return () => { mounted = false; };
  }, []);

  const formatPrice = (v?: number) => {
    if (v == null) return '—';
    return `${new Intl.NumberFormat().format(v)} LKR`;
  };

  const getCustomerName = (a: any) => {
    if (!a) return '—';
    return (
      a.customerName
      ?? a.customer?.user?.normalizedUserName
      ?? a.customer?.user?.userName
      ?? a.customer?.userName
      ?? a.user?.userName
      ?? a.userName
      ?? a.customer?.name
      ?? ((a.customer?.firstName || a.customer?.lastName) ? `${a.customer?.firstName ?? ''} ${a.customer?.lastName ?? ''}`.trim() : undefined)
      ?? a.customer?.user?.email
      ?? a.customer?.email
      ?? a.customerID
      ?? '—'
    );
  };

  const getCustomerEmail = (a: any) => {
    if (!a) return '—';
    return (
      a.customerEmail
      ?? a.customer?.user?.email
      ?? a.user?.email
      ?? a.email
      ?? a.customer?.email
      ?? '—'
    );
  };

  const filteredAppointments = useMemo(() => {
    if (!appointmentServices) return [] as AppointmentServiceDto[];
    return appointmentServices.filter(a => {
      if (apptStatusFilter !== 'All' && a.status !== apptStatusFilter) return false;
      if (apptOptionFilter !== 'All' && a.serviceOption !== apptOptionFilter) return false;
      if (query) {
        const hay = `${getCustomerName(a)} ${getCustomerEmail(a)} ${a.vehicleInfo ?? ''}`.toLowerCase();
        if (!hay.includes(query.toLowerCase())) return false;
      }
      return true;
    });
  }, [appointmentServices, apptStatusFilter, apptOptionFilter, query]);

  // Status change helpers
  const changeAppointmentStatus = async (appointmentID: number | undefined, status: 'Approved' | 'Rejected' | 'Completed') => {
    if (!appointmentID) return;
    try {
      await updateAppointmentStatus(appointmentID, status);
      setAppointmentServices(prev => prev ? prev.map(a => (a.appointmentID === appointmentID ? { ...a, status } : a)) : prev);
      if (selectedAppointment && selectedAppointment.appointmentID === appointmentID) {
        setSelectedAppointment(prev => prev ? { ...prev, status } : prev);
      }
    } catch (err: any) {
      toast.show('Failed to update status: ' + (err?.message || String(err)), 'error');
    }
  };


  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Services</h1>

        {/* Local dummy services removed - page uses backend catalog and appointment services */}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Available Services (catalog)</h2>
          {loadingCatalog && <div className="text-sm text-gray-300 mb-2">Loading services catalog...</div>}
          {catalogError && <div className="text-sm text-red-500 mb-2">{catalogError}</div>}
          {catalog && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catalog.map(c => (
                <div key={c.serviceID ?? c.code} className="bg-[#2a2a2a] p-4 rounded border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-gray-400">{c.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-300">{c.duration ?? '—'} min</div>
                      <div className="text-red-500 font-bold">{typeof c.price === 'number' ? `$${c.price.toFixed(2)}` : '—'}</div>
                    </div>
                  </div>
                    <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        if (!c.serviceID) return;
                        setEditingServiceId(c.serviceID ?? null);
                        setEditForm({
                          code: c.code,
                          title: c.title,
                          description: c.description,
                          duration: c.duration,
                          price: c.price,
                          status: c.status,
                        });
                      }}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      disabled={deletingServiceId === c.serviceID}
                        onClick={async () => {
                        if (!c.serviceID) return;
                        const ok = window.confirm(`Delete service "${c.title}"? This action cannot be undone.`);
                        if (!ok) return;
                        try {
                          setDeletingServiceId(c.serviceID ?? null);
                          await deleteService(c.serviceID);
                          setCatalog(prev => prev ? prev.filter(s => s.serviceID !== c.serviceID) : prev);
                        } catch (err: any) {
                          toast.show('Failed to delete service: ' + (err?.message || String(err)), 'error');
                        } finally {
                          setDeletingServiceId(null);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      {deletingServiceId === c.serviceID ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}

          {/* Edit dialog modal */}
          {editingServiceId != null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-2xl bg-[#0b0c0d]/90 p-6 rounded-2xl border border-gray-800">
                <h3 className="text-lg font-semibold mb-3">Edit Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400">Code</label>
                    <input value={editForm.code ?? ''} onChange={e => setEditForm(f => ({ ...f, code: e.target.value }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Title</label>
                    <input value={editForm.title ?? ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400">Description</label>
                    <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm" rows={4} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Duration (min)</label>
                    <input type="number" value={editForm.duration ?? ''} onChange={e => setEditForm(f => ({ ...f, duration: e.target.value === '' ? undefined : Number(e.target.value) }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Price</label>
                    <input type="number" value={editForm.price ?? ''} onChange={e => setEditForm(f => ({ ...f, price: e.target.value === '' ? undefined : Number(e.target.value) }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Status</label>
                    <select value={editForm.status ?? ''} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} className="w-full mt-1 p-2 bg-[#1a1a1a] rounded text-sm">
                      <option value="">(unchanged)</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setEditingServiceId(null)} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded">Cancel</button>
                  <button disabled={savingServiceId === editingServiceId} onClick={async () => {
                    try {
                      setSavingServiceId(editingServiceId);
                      const updated = await updateService(editingServiceId!, editForm);
                      setCatalog(prev => prev ? prev.map(s => s.serviceID === updated.serviceID ? updated : s) : prev);
                      setEditingServiceId(null);
                    } catch (err: any) {
                      toast.show('Failed to update service: ' + (err?.message || String(err)), 'error');
                    } finally {
                      setSavingServiceId(null);
                    }
                  }} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded">{savingServiceId === editingServiceId ? 'Saving…' : 'Save changes'}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold mb-4">Service Appointments</h2>
              <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search customer, email or vehicle"
                className="bg-[#2a2a2a] p-2 rounded text-sm w-64"
              />
              <select value={apptStatusFilter} onChange={(e) => setApptStatusFilter(e.target.value)} className="bg-[#2a2a2a] p-2 rounded text-sm">
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Completed</option>
                <option>Rejected</option>
              </select>
              <select value={apptOptionFilter} onChange={(e) => setApptOptionFilter(e.target.value)} className="bg-[#2a2a2a] p-2 rounded text-sm">
                <option>All</option>
                <option>Full</option>
                <option>Custom</option>
              </select>
                <button onClick={() => void loadAppointmentServices()} className="bg-gray-600 hover:bg-gray-700 text-sm px-3 py-1 rounded">Retry</button>
                <a href="/employee/services/add" className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1 rounded">Add Service</a>
            </div>
          </div>

          {loadingAppointmentServices && <div className="text-sm text-gray-300 mb-2">Loading service appointments...</div>}
          {appointmentServicesError && <div className="text-sm text-red-500 mb-2">{appointmentServicesError}</div>}

          {!loadingAppointmentServices && appointmentServices && filteredAppointments.length === 0 && (
            <div className="text-sm text-gray-400">No service appointments match your filters.</div>
          )}

          {filteredAppointments.length > 0 && (
            <div className="space-y-3">
              {filteredAppointments.map(a => (
                <div key={a.appointmentID}>
                  <div className="bg-[#2a2a2a] p-4 rounded border border-gray-700">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{getCustomerName(a)}</div>
                        <div className="text-sm text-gray-400">{getCustomerEmail(a)} • {a.vehicleInfo}</div>
                        <div className="text-sm text-gray-400">{a.startDate ? new Date(a.startDate).toLocaleString() : a.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">Status: <span className="font-medium">{a.status}</span></div>
                        <div className="text-red-500 font-bold">{formatPrice(a.totalPrice)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {a.packageName && <div className="text-sm">Package: {a.packageName} ({a.packageType})</div>}
                      {a.packageServices && a.packageServices.length > 0 && (
                        <ul className="text-sm mt-1 list-disc list-inside text-gray-300">
                          {a.packageServices.map((ps, i) => (<li key={i}>{ps.title} — {formatPrice(ps.price)}</li>))}
                        </ul>
                      )}
                      {a.customServices && a.customServices.length > 0 && (
                        <div className="mt-1 text-sm text-gray-300">Custom services:
                          <ul className="list-disc list-inside">
                            {a.customServices.map((cs, i) => (<li key={i}>{cs.title} — {formatPrice(cs.price)}</li>))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => setSelectedAppointment(a)} className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded">View</button>
                      </div>
                    </div>
                  </div>

                  {/* Inline expanded details under the clicked row */}
                            {selectedAppointment && selectedAppointment.appointmentID === a.appointmentID && (
                  <div className="mt-6 bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                        <h2 className="text-2xl font-semibold">Appointment - {getCustomerName(selectedAppointment)}</h2>
                        <div className="text-sm text-gray-300">{selectedAppointment!.startDate ? new Date(selectedAppointment!.startDate).toLocaleString() : selectedAppointment!.time}</div>
                        <div className="mt-3 text-gray-200">Vehicle: {selectedAppointment!.vehicleInfo}</div>
                        <div className="mt-2 text-gray-200">Assigned To: {selectedAppointment!.employeeName ?? 'Not Assigned'}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-right">
                          <div className="text-sm">Status: <span className="font-medium">{selectedAppointment!.status}</span></div>
                          <div className="text-red-500 font-bold mt-1">{formatPrice(selectedAppointment!.totalPrice)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedAppointment!.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => {
                          const uid = (typeof window !== 'undefined') ? (localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('userID') ?? localStorage.getItem('userid') ?? localStorage.getItem('UserID')) : null;
                          console.log('Approving appointment - UserID (from localStorage):', uid);
                          changeAppointmentStatus(selectedAppointment!.appointmentID, 'Approved');
                        }}
                        className="px-3 py-1 bg-green-600 rounded text-sm"
                      >
                        Approve
                      </button>
                      <button onClick={() => changeAppointmentStatus(selectedAppointment!.appointmentID, 'Rejected')} className="px-3 py-1 bg-gray-700 rounded text-sm">Reject</button>
                    </>
                  )}
                  {selectedAppointment!.status === 'Approved' && (
                    <button onClick={() => changeAppointmentStatus(selectedAppointment!.appointmentID, 'Completed')} className="px-3 py-1 bg-blue-600 rounded text-sm">Mark Complete</button>
                  )}
                  <button onClick={() => setSelectedAppointment(null)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Close</button>
                </div>
              </div>
            </div>

            <div className="mt-4">
                      {selectedAppointment!.packageName && <div className="text-sm">Package: {selectedAppointment!.packageName} ({selectedAppointment!.packageType})</div>}
                      {selectedAppointment!.packageServices && selectedAppointment!.packageServices.length > 0 && (
                        <ul className="text-sm mt-1 list-disc list-inside text-gray-300">
                          {selectedAppointment!.packageServices.map((ps, i) => (<li key={i}>{ps.title} — {formatPrice(ps.price)}</li>))}
                        </ul>
                      )}
                      {selectedAppointment!.customServices && selectedAppointment!.customServices.length > 0 && (
                        <div className="mt-1 text-sm text-gray-300">Custom services:
                          <ul className="list-disc list-inside">
                            {selectedAppointment!.customServices.map((cs, i) => (<li key={i}>{cs.title} — {formatPrice(cs.price)}</li>))}
                          </ul>
                        </div>
                      )}
            </div>
          </div>
        )}
                  
                </div>
              ))}
            </div>
          )}
        </div>

       
      </main>
    </div>
  );
}
