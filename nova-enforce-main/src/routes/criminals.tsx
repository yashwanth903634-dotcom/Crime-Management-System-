import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus, Search, Filter, Edit3, Trash2, Eye, ChevronLeft, ChevronRight,
  Download, X, Upload, FileX, Camera,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { CRIME_TYPES, STATUSES, Criminal } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/criminals")({
  head: () => ({
    meta: [
      { title: "Criminal Records — CRMS" },
      { name: "description", content: "Manage criminal records, search, filter and edit case files." },
    ],
  }),
  component: CriminalsPage,
});

type Mode = "add" | "edit" | "view" | null;

function CriminalsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [crimeFilter, setCrimeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<Mode>(null);
  const [active, setActive] = useState<Criminal | null>(null);
  const [criminalsData, setCriminalsData] = useState<Criminal[]>([]);
  const pageSize = 8;

  const fetchCriminals = () => {
    fetch(`http://localhost:5000/api/criminals?t=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          ...item,
          caseId: item.case_id || "",
          criminalId: item.criminal_id || "",
          name: item.criminal_name || "",
          crimeType: item.crime_type || "",
          arrestDate: item.arrest_date ? item.arrest_date.substring(0, 10) : "",
          dateOfCrime: item.crime_date ? item.crime_date.substring(0, 10) : "",
          fatherName: item.father_name || "",
          birthMark: item.birth_mark || "",
          policeStation: item.police_station || "",
          photo: item.criminal_photo || "",
        }));
        setCriminalsData(mapped);
      })
      .catch((err) => console.error("Error fetching criminals:", err));
  };

  useEffect(() => {
    fetchCriminals();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await fetch(`http://localhost:5000/api/criminals/${id}`, { method: 'DELETE' });
        fetchCriminals();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filtered = useMemo(() => {
    return criminalsData.filter((c) => {
      const q = query.toLowerCase();
      const matchesQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.caseId.toLowerCase().includes(q) ||
        c.criminalId.toLowerCase().includes(q) ||
        c.nickname.toLowerCase().includes(q);
      const matchesS = statusFilter === "all" || c.status === statusFilter;
      const matchesC = crimeFilter === "all" || c.crimeType === crimeFilter;
      return matchesQ && matchesS && matchesC;
    });
  }, [query, statusFilter, crimeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openModal = (m: Mode, c: Criminal | null = null) => {
    setActive(c);
    setMode(m);
  };

  return (
    <DashboardLayout title="Criminal Records">
      <div className="rounded-2xl glass p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Records Database</h2>
            <p className="text-xs text-muted-foreground">
              {filtered.length.toLocaleString()} records · live sync
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-secondary/60 px-3 text-sm ring-1 ring-border hover:bg-secondary">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => openModal("add")}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-neon px-4 text-sm font-semibold text-neon-foreground shadow-neon transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> Add Criminal
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, case ID, criminal ID or nickname…"
              className="h-10 w-full rounded-lg bg-input/60 pl-10 pr-3 text-sm outline-none ring-1 ring-border focus:ring-neon"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="h-10 w-full rounded-lg bg-input/60 pl-10 pr-8 text-sm outline-none ring-1 ring-border focus:ring-neon sm:w-44"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <select
            value={crimeFilter}
            onChange={(e) => { setCrimeFilter(e.target.value); setPage(1); }}
            className="h-10 rounded-lg bg-input/60 px-3 text-sm outline-none ring-1 ring-border focus:ring-neon sm:w-44"
          >
            <option value="all">All crimes</option>
            {CRIME_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto scrollbar-thin rounded-xl border border-border/60">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-secondary/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                {["Case ID", "Criminal ID", "Name", "Nickname", "Crime", "Arrest", "Date of Crime", "Address", "Age", "Occupation", "Gender", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-16">
                    <div className="flex flex-col items-center text-center">
                      <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary ring-1 ring-border">
                        <FileX className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-3 text-sm font-medium">No records found</p>
                      <p className="text-xs text-muted-foreground">Adjust your filters or add a new criminal record.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((c) => (
                  <tr key={c.caseId} className="border-t border-border/60 transition hover:bg-secondary/30">
                    <td className="px-3 py-3 font-mono text-xs text-neon whitespace-nowrap">{c.caseId}</td>
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{c.criminalId}</td>
                    <td className="px-3 py-3 font-medium whitespace-nowrap">{c.name}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.nickname}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{c.crimeType}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.arrestDate}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.dateOfCrime}</td>
                    <td className="px-3 py-3 text-muted-foreground max-w-[200px] truncate">{c.address}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{c.age}</td>
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">{c.occupation}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{c.gender}</td>
                    <td className="px-3 py-3 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <IconBtn label="View" onClick={() => openModal("view", c)}><Eye className="h-4 w-4" /></IconBtn>
                        <IconBtn label="Edit" onClick={() => openModal("edit", c)}><Edit3 className="h-4 w-4" /></IconBtn>
                        <IconBtn label="Delete" variant="danger" onClick={() => handleDelete((c as any).id)}><Trash2 className="h-4 w-4" /></IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            Showing <span className="text-foreground">{(page - 1) * pageSize + 1}</span>–
            <span className="text-foreground">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
            <span className="text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-border hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn(
                  "h-8 min-w-8 rounded-md px-2.5 text-xs ring-1 transition",
                  page === i + 1
                    ? "bg-neon text-neon-foreground ring-neon shadow-neon"
                    : "ring-border hover:bg-secondary",
                )}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="grid h-8 w-8 place-items-center rounded-md ring-1 ring-border hover:bg-secondary disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {mode && (
        <CriminalModal
          mode={mode}
          data={active as any}
          onClose={() => { setMode(null); setActive(null); }}
          onSuccess={fetchCriminals}
        />
      )}
    </DashboardLayout>
  );
}

function IconBtn({
  children, label, onClick, variant = "default",
}: { children: React.ReactNode; label: string; onClick?: () => void; variant?: "default" | "danger" }) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md ring-1 transition",
        variant === "danger"
          ? "ring-border text-destructive hover:bg-destructive/10 hover:ring-destructive/40"
          : "ring-border hover:bg-secondary hover:text-neon hover:ring-neon/40",
      )}
    >
      {children}
    </button>
  );
}

function CriminalModal({ mode, data, onClose, onSuccess }: { mode: Mode; data: any | null; onClose: () => void; onSuccess: () => void }) {
  const readOnly = mode === "view";
  const title =
    mode === "add" ? "Add Criminal Record" :
      mode === "edit" ? "Edit Criminal Record" : "Criminal Record";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!formData.get('status')) formData.append('status', data?.status || 'Wanted');

    const ageVal = formData.get('age');
    if (!ageVal) formData.set('age', '0');

    if (!formData.get('arrest_date')) formData.delete('arrest_date');
    if (!formData.get('crime_date')) formData.delete('crime_date');

    const url = mode === 'edit' && data?.id ? `http://localhost:5000/api/criminals/${data.id}` : 'http://localhost:5000/api/criminals';
    const method = mode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const text = await res.text();
        alert(`Failed to save record: ${text}`);
        console.error("Failed to save", text);
      }
    } catch (err: any) {
      alert(`Error saving record: ${err.message}`);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm animate-fade-up">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto scrollbar-thin rounded-2xl glass-strong shadow-elev">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-card/70 px-6 py-4 backdrop-blur">
          <div>
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground">
              {data ? `${data.caseId} · ${data.name}` : "Enter complete details below"}
            </p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg ring-1 ring-border hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="grid gap-5 p-6 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2 flex items-center gap-4 rounded-xl border border-dashed border-border/80 bg-secondary/30 p-4">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-xl bg-secondary ring-1 ring-border">
              <Camera className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Criminal Photo</p>
              <p className="text-xs text-muted-foreground">JPG or PNG · max 5MB</p>
            </div>
            <label className={cn(
              "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-secondary/60 px-3 text-xs ring-1 ring-border hover:bg-secondary",
              readOnly && "pointer-events-none opacity-50"
            )}>
              <Upload className="h-3.5 w-3.5" /> Upload
              <input type="file" name="image" className="hidden" accept="image/*" />
            </label>
          </div>

          <Field label="Case ID" name="case_id" defaultValue={data?.caseId} readOnly={readOnly} placeholder="CS-01284" />
          <Field label="Criminal ID" name="criminal_id" defaultValue={data?.criminalId} readOnly={readOnly} placeholder="CR-07125" />
          <Field label="Criminal Name" name="criminal_name" defaultValue={data?.name} readOnly={readOnly} />
          <Field label="Nickname" name="nickname" defaultValue={data?.nickname} readOnly={readOnly} />
          <SelectField label="Crime Type" name="crime_type" defaultValue={data?.crimeType} readOnly={readOnly} options={CRIME_TYPES} />
          <Field label="Father Name" name="father_name" defaultValue={data?.fatherName} readOnly={readOnly} />
          <SelectField label="Gender" name="gender" defaultValue={data?.gender} readOnly={readOnly} options={["Male", "Female", "Other"]} />
          <Field label="Arrest Date" name="arrest_date" type="date" defaultValue={data?.arrestDate} readOnly={readOnly} />
          <Field label="Date of Crime" name="crime_date" type="date" defaultValue={data?.dateOfCrime} readOnly={readOnly} />
          <Field label="Age" name="age" type="number" defaultValue={data?.age?.toString()} readOnly={readOnly} />
          <Field label="Occupation" name="occupation" defaultValue={data?.occupation} readOnly={readOnly} />
          <Field label="Police Station" name="police_station" defaultValue={data?.policeStation} readOnly={readOnly} />
          <div className="sm:col-span-2">
            <Field label="Address" name="address" defaultValue={data?.address} readOnly={readOnly} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Birth Mark" name="birth_mark" defaultValue={data?.birthMark} readOnly={readOnly} />
          </div>
          <SelectField label="Status" name="status" defaultValue={data?.status || "Wanted"} readOnly={readOnly} options={STATUSES} />

          {!readOnly && (
            <div className="sm:col-span-2 mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-5">
              <button type="reset" className="h-10 rounded-lg bg-secondary/60 px-4 text-sm ring-1 ring-border hover:bg-secondary">
                Clear
              </button>
              <button type="submit" className="h-10 rounded-lg bg-neon px-5 text-sm font-semibold text-neon-foreground shadow-neon hover:brightness-110">
                {mode === "edit" ? "Update Record" : "Save Record"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", defaultValue, readOnly, placeholder,
}: { label: string; name?: string; type?: string; defaultValue?: string; readOnly?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 h-10 w-full rounded-lg bg-input/60 px-3 text-sm outline-none ring-1 ring-border transition",
          readOnly ? "opacity-80" : "focus:ring-neon",
        )}
      />
    </label>
  );
}

function SelectField({
  label, name, defaultValue, readOnly, options,
}: { label: string; name?: string; defaultValue?: string; readOnly?: boolean; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={readOnly}
        className="mt-1.5 h-10 w-full rounded-lg bg-input/60 px-3 text-sm outline-none ring-1 ring-border focus:ring-neon disabled:opacity-70"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
