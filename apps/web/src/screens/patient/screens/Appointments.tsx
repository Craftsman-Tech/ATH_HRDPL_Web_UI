import React, { useState, useMemo } from 'react';
import Icon from '../shared/Icon';
import Badge from '../shared/Badge';
import SecHead from '../shared/SecHead';
import MemberPicker from '../components/MemberPicker';
import { UPCOMING, PAST } from '../data/mockAppointments';
import { HOSPITALS, HOSPITAL_TYPES, TIME_SLOTS } from '../data/mockHospitals';
import type { Hospital, HospitalType } from '../data/mockHospitals';
import type { Member, ApptTab, UpcomingAppt } from '../types/patient.types';

interface AppointmentsProps { member: Member; toast: (m: string) => void; }

type BookStep = 'browse' | 'schedule' | 'done';

interface BookedInfo {
  hospital: Hospital;
  doctor:   string;
  dept:     string;
  apptType: string;
  dateISO:  string;
  datePretty: string;
  timeSlot: string;
  phone:    string;
  patient:  string;
}

/* ── Filled-star rating row (supports fractional ratings) ──────────────── */
const Stars: React.FC<{ value: number; size?: number }> = ({ value, size = 14 }) => {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <span className="hb-stars" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        const fill = Math.max(0, Math.min(1, value - i));
        const gid = `${uid}-${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id={gid}>
                <stop offset={`${fill * 100}%`} stopColor="#f5a623" />
                <stop offset={`${fill * 100}%`} stopColor="#e2e6e4" />
              </linearGradient>
            </defs>
            <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.9 6.2 20.97l1.1-6.47-4.7-4.58 6.5-.95z"
                  fill={`url(#${gid})`} />
          </svg>
        );
      })}
    </span>
  );
};

/* ── Hospital image with graceful fallback ─────────────────────────────── */
const HospitalImage: React.FC<{ src: string; name: string; type: HospitalType }> = ({ src, name, type }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="hb-img hb-img-fallback">
        <Icon name="records" size={26} />
        <span>{type}</span>
      </div>
    );
  }
  return <img className="hb-img" src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />;
};

const Appointments: React.FC<AppointmentsProps> = ({ member, toast }) => {
  const [tab, setTab] = useState<ApptTab>('upcoming');
  const [apptMember, setApptMember] = useState('self');

  // Locally tracked upcoming list so a fresh booking shows up immediately.
  const [upcoming, setUpcoming] = useState<UpcomingAppt[]>(UPCOMING);

  // Booking flow state
  const [bookStep, setBookStep]   = useState<BookStep>('browse');
  const [typeFilter, setTypeFilter] = useState<'All' | HospitalType>('All');
  const [sortBy, setSortBy]       = useState<'rating' | 'distance'>('rating');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [dept, setDept]         = useState('');
  const [doctor, setDoctor]     = useState('');
  const [apptType, setApptType] = useState('Consultation');
  const [date, setDate]         = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason]     = useState('');
  const [phone, setPhone]       = useState('+91 98765 43210');
  const [booked, setBooked]     = useState<BookedInfo | null>(null);

  const filtered = useMemo(() => {
    let list = typeFilter === 'All' ? HOSPITALS : HOSPITALS.filter(h => h.type === typeFilter);
    list = [...list].sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.distanceKm - b.distanceKm);
    return list;
  }, [typeFilter, sortBy]);

  const openBookTab = () => { setTab('book'); setBookStep('browse'); };

  const selectHospital = (h: Hospital) => {
    setHospital(h);
    setDept(h.departments[0] ?? '');
    setDoctor(h.doctors[0] ?? 'Any Available');
    setBookStep('schedule');
  };

  const prettyDate = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  };

  const confirmBooking = () => {
    if (!hospital)  { toast('Please select a hospital'); return; }
    if (!date)      { toast('Please choose a preferred date'); return; }
    if (!timeSlot)  { toast('Please choose a time slot'); return; }
    if (!phone.trim()) { toast('Please enter a phone number'); return; }

    const info: BookedInfo = {
      hospital, doctor, dept, apptType,
      dateISO: date, datePretty: prettyDate(date), timeSlot,
      phone: phone.trim(), patient: member.name,
    };

    // Add to the Upcoming list so it appears under that tab.
    const d = new Date(date + 'T00:00:00');
    const newAppt: UpcomingAppt = {
      dd: d.toLocaleDateString('en-IN', { day: '2-digit' }),
      mo: d.toLocaleDateString('en-IN', { month: 'short' }),
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      type: apptType, doctor, dept,
      time: timeSlot, room: hospital.name, mode: 'In-person',
      status: 'Confirmed', sColor: '#15a06b', sBg: '#dbf3e6',
    };
    setUpcoming(prev => [newAppt, ...prev]);
    setBooked(info);
    setBookStep('done');
    toast('Appointment booked successfully!');
  };

  const mapsLink = (h: Hospital) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.mapsQuery)}`;

  const buildMessage = (b: BookedInfo) =>
    `Vexoo — Appointment Confirmed\n\n` +
    `Patient: ${b.patient}\n` +
    `Hospital: ${b.hospital.name} (${b.hospital.type})\n` +
    `Doctor / Dept: ${b.doctor} - ${b.dept}\n` +
    `Type: ${b.apptType}\n` +
    `Date: ${b.datePretty}\n` +
    `Time Slot: ${b.timeSlot}\n` +
    `Location: ${b.hospital.address}\n` +
    `Map: ${mapsLink(b.hospital)}\n` +
    `Hospital Contact: ${b.hospital.phone}\n\n` +
    `Please arrive 15 minutes early. Reply here to reschedule. — Team Vexoo`;

  const whatsappLink = (b: BookedInfo) =>
    `https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(buildMessage(b))}`;
  const smsLink = (b: BookedInfo) =>
    `sms:${b.phone.replace(/\s/g, '')}?body=${encodeURIComponent(buildMessage(b))}`;

  const resetBooking = () => {
    setBookStep('browse'); setHospital(null); setDate(''); setTimeSlot('');
    setReason(''); setBooked(null); setTab('upcoming');
  };

  return (
    <div className="screen screen-anim">
      <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Appointments for</div>
        <MemberPicker value={apptMember} onChange={setApptMember} selfName={member.name} />
      </div>

      <div className="card" style={{ padding: 22 }}>
        <SecHead icon="calendar" title="Appointments" sub="Manage your visits and bookings"
          right={<div className="segmented">
            {(['upcoming', 'past', 'book'] as ApptTab[]).map(t => (
              <button key={t} className={`seg ${tab === t ? 'seg-on' : ''}`}
                onClick={() => { setTab(t); if (t === 'book') setBookStep('browse'); }}>
                {t === 'book' ? 'Book New' : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>} />

        {tab === 'upcoming' && (
          <div className="appt-list">
            {upcoming.map((a, i) => (
              <div key={i} className="appt">
                <div className="appt-date"><div className="appt-day">{a.day}</div><div className="appt-dd">{a.dd}</div><div className="appt-mo">{a.mo}</div></div>
                <div className="appt-info">
                  <div className="appt-type">{a.type}</div>
                  <div className="appt-doc">{a.doctor} · {a.dept}</div>
                  <div className="appt-meta">
                    <span><Icon name="clock" size={13} />{a.time}</span>
                    <span><Icon name="pin" size={13} />{a.room}</span>
                    <span><Icon name={a.mode === 'Video' ? 'message' : 'user'} size={13} />{a.mode}</span>
                  </div>
                </div>
                <div className="appt-side">
                  <Badge text={a.status} color={a.sColor} bg={a.sBg} dot />
                  <div className="appt-btns">
                    <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: 12.5, border: '1px solid var(--line)' }} onClick={() => toast('Reschedule requested')}>Reschedule</button>
                    <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: 12.5, color: '#e0414b' }} onClick={() => toast('Appointment cancelled')}>Cancel</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'past' && (
          <div className="appt-list">
            {PAST.map((p, i) => (
              <div key={i} className="appt">
                <div className="appt-date" style={{ background: '#f1f5f4' }}>
                  <div className="appt-day" style={{ color: '#7b8785' }}>Past</div>
                  <div className="appt-dd" style={{ fontSize: 15 }}>{p.date.split(' ')[1].replace(',', '')}</div>
                  <div className="appt-mo">{p.date.split(' ')[0]}</div>
                </div>
                <div className="appt-info">
                  <div className="appt-type">{p.type}</div>
                  <div className="appt-doc">{p.doctor} · {p.date}</div>
                  <div className="appt-meta"><span>{p.summary}</span></div>
                </div>
                <div className="appt-side">
                  <Badge text="Completed" color="#15a06b" bg="#dbf3e6" dot />
                  <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: 12.5, border: '1px solid var(--line)' }} onClick={() => toast('Opening visit summary')}>View Summary</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ───────────────────────── BOOK NEW ───────────────────────── */}
        {tab === 'book' && bookStep === 'browse' && (
          <div className="hb-wrap">
            <div className="hb-filterbar">
              <div className="hb-filter-chips">
                <button className={`hb-chip ${typeFilter === 'All' ? 'on' : ''}`} onClick={() => setTypeFilter('All')}>All</button>
                {HOSPITAL_TYPES.map(t => (
                  <button key={t} className={`hb-chip ${typeFilter === t ? 'on' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
                ))}
              </div>
              <div className="hb-sort">
                <span>Sort by</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as 'rating' | 'distance')}>
                  <option value="rating">Top rated</option>
                  <option value="distance">Nearest</option>
                </select>
              </div>
            </div>

            <div className="hb-count">{filtered.length} hospital{filtered.length !== 1 ? 's' : ''} near you{typeFilter !== 'All' ? ` · ${typeFilter}` : ''}</div>

            <div className="hb-list">
              {filtered.map(h => {
                const open = expandedId === h.id;
                return (
                  <div key={h.id} className="hb-card">
                    <HospitalImage src={h.image} name={h.name} type={h.type} />
                    <div className="hb-body">
                      <div className="hb-head">
                        <div>
                          <div className="hb-name">{h.name}</div>
                          <div className="hb-sub"><span className="hb-typebadge">{h.type}</span><span className="hb-dist"><Icon name="pin" size={12} />{h.distanceKm} km · {h.area}</span></div>
                        </div>
                        <div className="hb-ratebox">
                          <Stars value={h.rating} />
                          <div className="hb-ratenum">{h.rating.toFixed(1)}</div>
                          <div className="hb-revcount">{h.reviewCount.toLocaleString('en-IN')} reviews</div>
                        </div>
                      </div>

                      <div className="hb-highlights">
                        {h.highlights.map(x => <span key={x} className="hb-pill"><Icon name="check" size={11} />{x}</span>)}
                      </div>

                      {open && (
                        <div className="hb-details">
                          <div className="hb-detgrid">
                            <div><span className="hb-detlbl">Established</span>{h.established}</div>
                            <div><span className="hb-detlbl">Beds</span>{h.beds}</div>
                            <div><span className="hb-detlbl">Hours</span>{h.hours}</div>
                            <div><span className="hb-detlbl">Contact</span>{h.phone}</div>
                          </div>
                          <div className="hb-depts">
                            <span className="hb-detlbl">Departments</span>
                            <div className="hb-deptchips">{h.departments.map(d => <span key={d} className="hb-deptchip">{d}</span>)}</div>
                          </div>
                          <div className="hb-reviews">
                            <span className="hb-detlbl">Patient reviews</span>
                            {h.reviews.map((r, i) => (
                              <div key={i} className="hb-review">
                                <div className="hb-review-top"><strong>{r.author}</strong><Stars value={r.rating} size={12} /><span className="hb-review-date">{r.date}</span></div>
                                <div className="hb-review-text">{r.text}</div>
                              </div>
                            ))}
                          </div>
                          <a className="hb-maplink" href={mapsLink(h)} target="_blank" rel="noreferrer"><Icon name="pin" size={13} />View on Google Maps</a>
                        </div>
                      )}

                      <div className="hb-actions">
                        <button className="hb-detbtn" onClick={() => setExpandedId(open ? null : h.id)}>
                          {open ? 'Hide details' : 'View details & reviews'}
                        </button>
                        <button className="hb-bookbtn" onClick={() => selectHospital(h)}>
                          <Icon name="calendar" size={15} />Select & Book
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <div className="hb-empty">No hospitals match this filter. Try “All”.</div>}
            </div>
          </div>
        )}

        {tab === 'book' && bookStep === 'schedule' && hospital && (
          <div className="add-form">
            <div className="hb-chosen">
              <HospitalImage src={hospital.image} name={hospital.name} type={hospital.type} />
              <div className="hb-chosen-info">
                <div className="hb-name">{hospital.name}</div>
                <div className="hb-sub"><span className="hb-typebadge">{hospital.type}</span><Stars value={hospital.rating} size={13} /><span className="hb-ratenum" style={{ fontSize: 13 }}>{hospital.rating.toFixed(1)}</span></div>
                <div className="hb-chosen-addr"><Icon name="pin" size={12} />{hospital.address}</div>
              </div>
              <button className="hb-change" onClick={() => setBookStep('browse')}>Change</button>
            </div>

            <div className="af-grid" style={{ marginTop: 18 }}>
              <label className="af-field"><span>Department</span>
                <select value={dept} onChange={e => setDept(e.target.value)}>
                  {hospital.departments.map(o => <option key={o}>{o}</option>)}
                </select></label>
              <label className="af-field"><span>Preferred Doctor</span>
                <select value={doctor} onChange={e => setDoctor(e.target.value)}>
                  {hospital.doctors.map(o => <option key={o}>{o}</option>)}
                </select></label>
              <label className="af-field"><span>Appointment Type</span>
                <select value={apptType} onChange={e => setApptType(e.target.value)}>
                  {['Consultation', 'Routine Follow-up', 'Annual Physical', 'Urgent'].map(o => <option key={o}>{o}</option>)}
                </select></label>
              <label className="af-field"><span>Preferred Date</span>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
              <label className="af-field" style={{ gridColumn: '1 / -1' }}><span>Phone Number <em>(for confirmation)</em></span>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 …" /></label>
              <label className="af-field" style={{ gridColumn: '1 / -1' }}><span>Reason for Visit <em>(optional)</em></span>
                <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Briefly describe your symptoms…" /></label>
            </div>

            <div className="hb-slot-block">
              <div className="af-field"><span>Time Slot</span></div>
              {TIME_SLOTS.map(g => (
                <div key={g.group} className="hb-slotgroup">
                  <div className="hb-slotgroup-lbl">{g.group}</div>
                  <div className="hb-slots">
                    {g.slots.map(s => (
                      <button key={s} className={`hb-slot ${timeSlot === s ? 'on' : ''}`} onClick={() => setTimeSlot(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="af-actions">
              <button className="btn btn-outline" style={{ padding: '11px 18px', border: '1px solid var(--line)' }} onClick={() => setBookStep('browse')}>Back</button>
              <button className="btn btn-solid" style={{ padding: '11px 20px', background: 'var(--teal)', color: '#fff' }} onClick={confirmBooking}>
                <Icon name="check" size={16} />Confirm Booking
              </button>
            </div>
          </div>
        )}

        {tab === 'book' && bookStep === 'done' && booked && (
          <div className="hb-confirm">
            <div className="hb-confirm-icon"><Icon name="check" size={28} /></div>
            <div className="hb-confirm-title">Appointment Confirmed</div>
            <div className="hb-confirm-banner">
              Confirmation sent to {booked.phone} via WhatsApp &amp; direct message.
            </div>

            <div className="hb-confirm-card">
              <div className="hb-confirm-row"><span>Hospital</span><strong>{booked.hospital.name}</strong></div>
              <div className="hb-confirm-row"><span>Doctor / Dept</span><strong>{booked.doctor} · {booked.dept}</strong></div>
              <div className="hb-confirm-row"><span>Type</span><strong>{booked.apptType}</strong></div>
              <div className="hb-confirm-row"><span>Date</span><strong>{booked.datePretty}</strong></div>
              <div className="hb-confirm-row"><span>Time Slot</span><strong>{booked.timeSlot}</strong></div>
              <div className="hb-confirm-row"><span>Location</span><strong style={{ textAlign: 'right' }}>{booked.hospital.address}</strong></div>
              <div className="hb-confirm-row"><span>Maps</span>
                <a href={mapsLink(booked.hospital)} target="_blank" rel="noreferrer" className="hb-maplink" style={{ padding: 0 }}><Icon name="pin" size={13} />Open in Google Maps</a>
              </div>
            </div>

            <div className="hb-send-row">
              <a className="hb-send hb-send-wa" href={whatsappLink(booked)} target="_blank" rel="noreferrer">
                <Icon name="message" size={16} />Send via WhatsApp
              </a>
              <a className="hb-send hb-send-sms" href={smsLink(booked)}>
                <Icon name="phone" size={16} />Send via SMS
              </a>
            </div>

            <button className="btn btn-outline" style={{ marginTop: 14, padding: '11px 18px', border: '1px solid var(--line)' }} onClick={resetBooking}>
              Done — View my appointments
            </button>
          </div>
        )}
      </div>

      {tab !== 'book' && (
        <div className="card" style={{ padding: 22 }}>
          <div className="book-cta">
            <div className="book-ic"><Icon name="calendar" size={22} /></div>
            <div className="book-title">Need to see a specialist?</div>
            <div className="book-sub">Filter hospitals by type, compare ratings &amp; reviews, and book the next available slot near you.</div>
            <button className="btn btn-soft" style={{ padding: '10px 16px', background: '#eef6f4', color: 'var(--teal)' }} onClick={openBookTab}>
              <Icon name="plus" size={15} />Find &amp; Book a Hospital
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
