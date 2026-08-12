import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Avatar, Badge, Bar, Btn, Card, ChipRow, Eyebrow, Field, Hero, Icon, IconChip, ListRow, Section, Txt,
} from '@vexoo/ui-native';
import { mineral, mineralPalette } from '@vexoo/shared';
import {
  ADVICE, ALERTS, CHANGED, DEFAULT_VAX, FEED, FOLDERS, FOLDER_DOCS,
  HOSPITALS, INSIGHTS, INVOICES, LABS, MEDS, MEMBERS, PAST, QUICK, SEED_FAMILY, STATS,
  THREADS, TIMELINE, TRENDS, UPCOMING, WELLNESS, type ScreenId, type Slot,
} from '@vexoo/shared/customer';

/** Props every module screen receives from the shell. */
export interface ScreenProps {
  go: (s: ScreenId) => void;
  toast: (msg: string) => void;
  busy: (message: string, done?: string) => void;
  customerName: string;
  customerId: string;
}

const Row = ({ children, gap = 10 }: { children?: React.ReactNode; gap?: number }) => (
  <View style={{ flexDirection: 'row', gap }}>{children}</View>
);

// ── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ go, customerName, customerId }: ScreenProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const alerts = ALERTS.filter((a) => !dismissed.includes(a.title));
  const first = customerName.split(' ')[0];

  return (
    <>
      <Hero>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: mineral.primaryBright }} />
            <Eyebrow color="#AEE9E0">Today’s overview</Eyebrow>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Txt size={12} weight="700" tone="inverse" mono>87</Txt>
            <Eyebrow color="#C8F3EC">Excellent</Eyebrow>
          </View>
        </View>
        <Txt size={26} weight="700" tone="inverse" style={{ marginTop: 12 }}>Good morning, {first}</Txt>
        <Txt size={12} style={{ color: '#C8F3EC', marginTop: 6 }}>{customerId} · Blood A+ · Next May 15 · Dr. Chen</Txt>
        <Row>
          <Btn label="Book appointment" variant="light" onPress={() => go('appts')} style={{ flex: 1, marginTop: 14, height: 48 }} />
          <Btn label="My records" variant="light" onPress={() => go('records')} style={{ flex: 1, marginTop: 14, height: 48 }} />
        </Row>
      </Hero>

      <Section title="Vital signs" icon="heart" />
      {STATS.map((s) => (
        <Card key={s.label}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconChip icon={s.ic} color={s.color} bg={s.bg} />
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name={s.up ? 'up' : 'down'} size={14} color={s.good ? mineral.statusText.success : mineralPalette.coral} />
              <Txt size={12} weight="600" style={{ color: s.good ? mineral.statusText.success : mineralPalette.coral }}>{s.delta}</Txt>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 12, gap: 4 }}>
            <Txt size={28} weight="700" tone="heading" mono>{s.val}</Txt>
            <Txt size={13} tone="muted" style={{ marginBottom: 4 }}>{s.unit}</Txt>
          </View>
          <Txt size={14} weight="600" tone="heading" style={{ marginTop: 6 }}>{s.label}</Txt>
          <Txt size={12} tone="muted">{s.sub}</Txt>
        </Card>
      ))}

      <Section title="Quick actions" icon="spark" />
      {QUICK.map((q) => (
        <ListRow key={q.label} icon={q.ic} iconColor={q.color} iconBg={q.bg} title={q.label} onPress={() => go(q.to)} />
      ))}

      {alerts.length > 0 ? (
        <>
          <Section title="Needs attention" icon="alert" />
          {alerts.map((a) => (
            <Card key={a.title} style={{ backgroundColor: a.bg, borderColor: a.border }}>
              <View style={{ flexDirection: 'row' }}>
                <IconChip icon={a.ic} color={a.color} bg="#FFFFFF" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt size={14} weight="600" tone="heading">{a.title}</Txt>
                  <Txt size={12} tone="muted" style={{ marginTop: 2 }}>{a.text}</Txt>
                </View>
                <Pressable onPress={() => setDismissed((d) => [...d, a.title])} accessibilityLabel={`Dismiss ${a.title}`}>
                  <Icon name="x" size={16} color={mineral.textMuted} />
                </Pressable>
              </View>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Section title="Needs attention" icon="check" />
          <Card><Txt size={13} tone="muted" center>Nothing needs your attention.</Txt></Card>
        </>
      )}

      <Section title="Wellness score" icon="target" />
      <Card>
        {WELLNESS.map((w) => (
          <View key={w.label} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={w.ic} size={15} color={w.color} />
              <Txt size={13} weight="600" tone="secondary" style={{ flex: 1, marginLeft: 8 }}>{w.label}</Txt>
              <Txt size={12} tone="muted" mono>{w.val}</Txt>
            </View>
            <View style={{ marginTop: 7 }}><Bar pct={w.pct} color={w.color} /></View>
          </View>
        ))}
      </Card>

      <Section title="Recent changes" icon="refresh" />
      {CHANGED.map((c) => (
        <Card key={c.label} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconChip icon={c.icon} color={c.color} bg={c.bg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt size={14} weight="600" tone="heading">{c.label}</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Txt size={12} tone="muted" style={{ textDecorationLine: 'line-through' }}>{c.from}</Txt>
              <Icon name="arrowR" size={12} color={mineral.textMuted} />
              <Txt size={12} weight="600" style={{ color: c.color }}>{c.to}</Txt>
            </View>
          </View>
          <Badge color={c.color} bg={c.bg}>{c.status}</Badge>
        </Card>
      ))}

      <Section title="Health insights" icon="bulb" />
      {INSIGHTS.map((i) => (
        <Card key={i.text} style={{ flexDirection: 'row' }}>
          <IconChip icon={i.ic} color={i.color} bg={i.bg} />
          <Txt size={13} tone="secondary" style={{ flex: 1, marginLeft: 12 }}>{i.text}</Txt>
        </Card>
      ))}
      <Txt size={11} tone="muted" center style={{ marginBottom: 8 }}>
        Insights are informational only and are not medical advice.
      </Txt>

      <Section title="Recent activity" icon="clock" />
      {FEED.map((f) => (
        <Card key={f.text} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconChip icon={f.ic} color={f.color} bg={f.bg} size={34} />
          <Txt size={13} tone="secondary" style={{ flex: 1, marginLeft: 12 }}>{f.text}</Txt>
          <Txt size={11} tone="muted">{f.time}</Txt>
        </Card>
      ))}

      <Section title="From your doctor" icon="stetho" />
      {ADVICE.map((a) => (
        <Card key={a.title}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name={a.ic} size={16} color={mineral.primary} />
            <Txt size={14} weight="600" tone="heading" style={{ marginLeft: 8 }}>{a.title}</Txt>
          </View>
          <Txt size={12} tone="muted" style={{ marginTop: 6 }}>{a.detail}</Txt>
        </Card>
      ))}
    </>
  );
}

// ── Appointments ─────────────────────────────────────────────────────────────

const APPT_TABS = [
  { key: 'upcoming' as const, label: 'Upcoming' },
  { key: 'past' as const, label: 'Past' },
  { key: 'book' as const, label: 'Book' },
];

function Appointments({ toast, busy }: ScreenProps) {
  const [tab, setTab] = useState<'upcoming' | 'past' | 'book'>('upcoming');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <ChipRow options={APPT_TABS} value={tab} onChange={setTab} />
      <View style={{ height: 14 }} />

      {tab === 'upcoming' && UPCOMING.map((a) => (
        <Card key={`${a.dd}-${a.doctor}`}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 58, borderRadius: 14, backgroundColor: mineral.primaryLight, alignItems: 'center', paddingVertical: 10 }}>
              <Txt size={20} weight="700" style={{ color: mineral.primaryDeep }} mono>{a.dd}</Txt>
              <Txt size={11} weight="600" style={{ color: mineral.primaryDeep }}>{a.mo}</Txt>
              <Txt size={10} tone="muted">{a.day}</Txt>
            </View>
            <View style={{ flex: 1, marginLeft: 13 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Txt size={15} weight="600" tone="heading" style={{ flex: 1 }}>{a.type}</Txt>
                <Badge color={a.sColor} bg={a.sBg}>{a.status}</Badge>
              </View>
              <Txt size={12} tone="muted" style={{ marginTop: 3 }}>{a.doctor} · {a.dept}</Txt>
              <Txt size={12} tone="muted" style={{ marginTop: 2 }}>{a.time} · {a.room} · {a.mode}</Txt>
            </View>
          </View>
          <Row>
            <Btn label="Reschedule" variant="outline" onPress={() => toast('Reschedule requested')} style={{ flex: 1, marginTop: 12, height: 44 }} />
            <Btn label="Cancel" variant="outline" onPress={() => toast('Appointment cancelled')} style={{ flex: 1, marginTop: 12, height: 44 }} />
          </Row>
        </Card>
      ))}

      {tab === 'past' && PAST.map((p) => (
        <Card key={`${p.date}-${p.doctor}`}>
          <Txt size={14} weight="600" tone="heading">{p.type}</Txt>
          <Txt size={12} tone="muted" style={{ marginTop: 2 }}>{p.date} · {p.doctor}</Txt>
          <Txt size={12} tone="secondary" style={{ marginTop: 8 }}>{p.summary}</Txt>
          <Btn label="View notes" variant="outline" onPress={() => busy('Opening visit notes', 'Notes ready')} style={{ marginTop: 12, height: 44 }} />
        </Card>
      ))}

      {tab === 'book' && (
        <>
          <Section title="Choose a hospital" icon="pin" />
          {HOSPITALS.map((h) => {
            const open = expanded === h.name;
            return (
              <Card key={h.name}>
                <Pressable onPress={() => setExpanded(open ? null : h.name)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconChip icon="pin" size={44} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Txt size={15} weight="600" tone="heading">{h.name}</Txt>
                    <Txt size={12} tone="muted" style={{ marginTop: 2 }}>
                      {h.type} · {h.distanceKm} km · ★ {h.rating} ({h.reviewCount})
                    </Txt>
                  </View>
                  <Icon name="chevron" size={16} color={mineral.textMuted} />
                </Pressable>
                {open ? (
                  <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: mineral.borderFaint, paddingTop: 12 }}>
                    <Txt size={12} tone="secondary">{h.address}</Txt>
                    <Txt size={12} tone="muted" style={{ marginTop: 6 }}>{h.hours} · {h.phone}</Txt>
                    <Btn label="Book here" onPress={() => busy('Confirming your booking', 'Appointment booked')} style={{ marginTop: 12, height: 46 }} />
                  </View>
                ) : null}
              </Card>
            );
          })}
        </>
      )}
    </>
  );
}

// ── Health Records ───────────────────────────────────────────────────────────

function Records({ busy }: ScreenProps) {
  const [folder, setFolder] = useState<string | null>(null);
  return (
    <>
      <Row>
        <Btn label="Upload" icon="plus" onPress={() => busy('Uploading document', 'Document uploaded')} style={{ flex: 1 }} />
        <Btn label="Export all" variant="outline" icon="download" onPress={() => busy('Zipping your records', 'ZIP ready')} style={{ flex: 1 }} />
      </Row>

      <Section title="Folders" icon="records" />
      {FOLDERS.map((f) => (
        <ListRow
          key={f.name}
          icon={f.ic}
          iconColor={f.color}
          iconBg={f.bg}
          title={f.name}
          subtitle={`${f.count} documents · ${f.meta}`}
          onPress={() => setFolder(folder === f.name ? null : f.name)}
        />
      ))}

      {folder ? (
        <>
          <Section title={folder} icon="doc" />
          {(FOLDER_DOCS[folder] ?? []).map((d) => (
            <Card key={d.name}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconChip icon="doc" color={mineralPalette.coral} bg="#FBE3E5" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Txt size={14} weight="600" tone="heading">{d.name}</Txt>
                  <Txt size={11} tone="muted" mono>{d.date} · {d.type}</Txt>
                </View>
              </View>
              <Row>
                <Btn label="View" variant="outline" onPress={() => busy(`Opening ${d.name}`)} style={{ flex: 1, marginTop: 10, height: 44 }} />
                <Btn label="Download" variant="outline" onPress={() => busy(`Downloading ${d.name}`, 'Downloaded')} style={{ flex: 1, marginTop: 10, height: 44 }} />
              </Row>
            </Card>
          ))}
        </>
      ) : null}

      <Section title="Visit timeline" icon="clock" />
      {TIMELINE.map((v) => (
        <Card key={`${v.date}-${v.title}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: v.color }} />
            <Txt size={14} weight="600" tone="heading" style={{ flex: 1, marginLeft: 10 }}>{v.title}</Txt>
            <Txt size={11} tone="muted">{v.date}</Txt>
          </View>
          <Txt size={12} tone="muted" style={{ marginTop: 4, marginLeft: 20 }}>{v.doctor}</Txt>
          <Txt size={12} tone="secondary" style={{ marginTop: 6, marginLeft: 20 }}>{v.summary}</Txt>
        </Card>
      ))}
    </>
  );
}

// ── Medications ──────────────────────────────────────────────────────────────

const SLOTS: Slot[] = ['morning', 'noon', 'night'];

function Medications({ busy }: ScreenProps) {
  return (
    <>
      <Btn label="Request a refill" icon="pill" onPress={() => busy('Placing your refill', 'Refill placed')} />
      <Section title="Today’s schedule" icon="pill" />
      {MEDS.map((m) => (
        <Card key={m.name}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconChip icon={m.icon} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt size={15} weight="600" tone="heading">{m.name}</Txt>
              <Txt size={12} tone="muted">{m.dose} · {m.purpose}</Txt>
            </View>
            <Badge
              color={m.status === 'Active' ? mineral.statusText.success : mineral.statusText.neutral}
              bg={m.status === 'Active' ? mineral.statusBg.success : mineral.statusBg.neutral}
            >
              {m.status}
            </Badge>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {SLOTS.map((slot) => {
              const state = m.schedule[slot];
              const taken = state === 'taken';
              const off = state === 'off';
              return (
                <View
                  key={slot}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    paddingVertical: 9,
                    alignItems: 'center',
                    backgroundColor: off ? mineral.borderFaint : taken ? mineral.statusBg.success : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: off ? mineral.borderFaint : taken ? mineral.statusBg.success : mineral.border,
                  }}
                >
                  <Txt size={11} weight="600" tone={off ? 'muted' : taken ? 'brand' : 'secondary'}>
                    {slot[0].toUpperCase() + slot.slice(1)}
                  </Txt>
                </View>
              );
            })}
          </View>
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row' }}>
              <Txt size={12} tone="muted" style={{ flex: 1 }}>{m.remaining} of {m.total} left</Txt>
              <Txt size={12} tone="muted">Refill {m.refill}</Txt>
            </View>
            <View style={{ marginTop: 6 }}><Bar pct={(m.remaining / m.total) * 100} /></View>
          </View>
        </Card>
      ))}
    </>
  );
}

// ── Lab Results ──────────────────────────────────────────────────────────────

function LabResults({ busy }: ScreenProps) {
  const [trend, setTrend] = useState(TRENDS[0]?.key ?? '');
  const active = TRENDS.find((t) => t.key === trend) ?? TRENDS[0];

  return (
    <>
      <Row>
        <Btn label="Upload report" icon="plus" onPress={() => busy('Uploading report', 'Report uploaded')} style={{ flex: 1 }} />
        <Btn label="Export all" variant="outline" icon="download" onPress={() => busy('Zipping your reports', 'ZIP ready')} style={{ flex: 1 }} />
      </Row>

      <Section title="Health trends" icon="up" />
      <ChipRow options={TRENDS.map((t) => ({ key: t.key, label: t.label }))} value={trend} onChange={setTrend} />
      {active ? (
        <Card style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
            <Txt size={30} weight="700" mono style={{ color: active.color }}>{active.data[active.data.length - 1]}</Txt>
            <Txt size={13} tone="muted" style={{ marginBottom: 5 }}>{active.unit}</Txt>
          </View>
          <Txt size={13} tone="secondary" style={{ marginTop: 4 }}>Latest {active.label.toLowerCase()}</Txt>
          <Txt size={12} tone="muted" style={{ marginTop: 2 }}>Target {active.target}</Txt>
          {/* Simple column plot — enough to read the direction of travel. */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 10, marginTop: 16 }}>
            {active.data.map((v, i) => {
              const max = Math.max(...active.data);
              const min = Math.min(...active.data);
              const t = max === min ? 0.5 : (v - min) / (max - min);
              return (
                <View key={active.labels[i] ?? i} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ width: '100%', height: 18 + t * 82, borderRadius: 6, backgroundColor: active.color, opacity: 0.28 + t * 0.72 }} />
                  <Txt size={10} tone="muted" style={{ marginTop: 6 }}>{active.labels[i]}</Txt>
                </View>
              );
            })}
          </View>
        </Card>
      ) : null}

      <Section title="Lab reports" icon="lab" />
      {LABS.map((l) => (
        <Card key={l.name}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconChip icon="lab" color={l.color} bg={mineral.primaryLight} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt size={14} weight="600" tone="heading">{l.name}</Txt>
              <Txt size={11} tone="muted">{l.date} · {l.doctor}</Txt>
            </View>
            <Badge color={l.color} bg={mineral.statusBg.success}>{l.status}</Badge>
          </View>
          <View style={{ marginTop: 12 }}>
            {l.rows.map((r) => (
              <View key={r.k} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7, borderTopWidth: 1, borderTopColor: mineral.borderFaint }}>
                <Txt size={12.5} tone="secondary" style={{ flex: 1.4 }}>{r.k}</Txt>
                <Txt size={13} weight="600" tone="heading" mono style={{ flex: 0.8 }}>{r.v} <Txt size={11} tone="muted">{r.u}</Txt></Txt>
                <Txt size={11} tone="muted" style={{ flex: 1 }}>Ref: {r.ref}</Txt>
                <Badge
                  color={r.flag === 'normal' ? mineral.statusText.success : r.flag === 'high' ? mineral.statusText.danger : mineral.statusText.warning}
                  bg={r.flag === 'normal' ? mineral.statusBg.success : r.flag === 'high' ? mineral.statusBg.danger : mineral.statusBg.warning}
                >
                  {r.flag}
                </Badge>
              </View>
            ))}
          </View>
          <Row>
            <Btn label="View" variant="outline" onPress={() => busy(`Opening ${l.name}`)} style={{ flex: 1, marginTop: 12, height: 44 }} />
            <Btn label="Download" variant="outline" onPress={() => busy(`Downloading ${l.name}`, 'Downloaded')} style={{ flex: 1, marginTop: 12, height: 44 }} />
          </Row>
        </Card>
      ))}
    </>
  );
}

// ── Vaccinations ─────────────────────────────────────────────────────────────

function Vaccinations(_: ScreenProps) {
  const [member, setMember] = useState(MEMBERS[0]?.id ?? '');
  const counts = {
    ok: DEFAULT_VAX.filter((v) => v.status === 'Up to date').length,
    soon: DEFAULT_VAX.filter((v) => v.status === 'Due soon').length,
    over: DEFAULT_VAX.filter((v) => v.status === 'Overdue').length,
  };
  const tone = (s: string) =>
    s === 'Up to date' ? { c: mineral.statusText.success, b: mineral.statusBg.success }
    : s === 'Due soon' ? { c: mineral.statusText.warning, b: mineral.statusBg.warning }
    : { c: mineral.statusText.danger, b: mineral.statusBg.danger };

  return (
    <>
      <ChipRow options={MEMBERS.map((m) => ({ key: m.id, label: m.name }))} value={member} onChange={setMember} />
      <View style={{ height: 14 }} />
      <Row>
        {[
          { n: counts.ok, l: 'Up to date', c: mineral.statusText.success, b: mineral.statusBg.success },
          { n: counts.soon, l: 'Due soon', c: mineral.statusText.warning, b: mineral.statusBg.warning },
          { n: counts.over, l: 'Overdue', c: mineral.statusText.danger, b: mineral.statusBg.danger },
        ].map((t) => (
          <Card key={t.l} style={{ flex: 1, alignItems: 'center', backgroundColor: t.b, borderColor: t.b }}>
            <Txt size={24} weight="700" mono style={{ color: t.c }}>{t.n}</Txt>
            <Txt size={11} weight="600" style={{ color: t.c, marginTop: 2 }}>{t.l}</Txt>
          </Card>
        ))}
      </Row>

      <Section title="Immunisation record" icon="syringe" />
      {DEFAULT_VAX.map((v) => {
        const t = tone(v.status);
        return (
          <Card key={v.name} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconChip icon="syringe" color={t.c} bg={t.b} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt size={14} weight="600" tone="heading">{v.name}</Txt>
              <Txt size={11} tone="muted" style={{ marginTop: 2 }}>Last {v.last} · Next {v.next}</Txt>
            </View>
            <Badge color={t.c} bg={t.b}>{v.status}</Badge>
          </Card>
        );
      })}
    </>
  );
}

// ── Family ───────────────────────────────────────────────────────────────────

function Family({ busy }: ScreenProps) {
  const [selected, setSelected] = useState(SEED_FAMILY[0]?.id ?? '');
  const member = SEED_FAMILY.find((m) => m.id === selected) ?? SEED_FAMILY[0];

  return (
    <>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconChip icon="users" size={44} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Txt size={15} weight="600" tone="heading">Household</Txt>
          <Txt size={12} tone="muted">{SEED_FAMILY.length} members</Txt>
        </View>
        <Btn label="Add" icon="plus" onPress={() => busy('Adding member', 'Member added')} style={{ height: 42, paddingHorizontal: 14 }} />
      </Card>

      <ChipRow options={SEED_FAMILY.map((m) => ({ key: m.id, label: m.name }))} value={selected} onChange={setSelected} />

      {member ? (
        <>
          <Section title={member.name} icon="user" />
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Avatar name={member.name} size={48} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt size={16} weight="600" tone="heading">{member.name}</Txt>
                <Txt size={12} tone="muted">{member.relation} · {member.age ?? '—'} yrs · {member.sex}</Txt>
              </View>
              <Badge>{member.blood}</Badge>
            </View>
            {member.condition ? (
              <Txt size={12} tone="secondary" style={{ marginTop: 12 }}>Condition: {member.condition}</Txt>
            ) : null}
          </Card>

          <Section title="Records" icon="records" />
          {FOLDERS.slice(0, 3).map((f) => (
            <ListRow key={f.name} icon={f.ic} iconColor={f.color} iconBg={f.bg} title={f.name} subtitle={`${f.count} documents`} onPress={() => busy(`Opening ${f.name}`)} />
          ))}
        </>
      ) : null}
    </>
  );
}

// ── Messages ─────────────────────────────────────────────────────────────────

function Messages({ toast }: ScreenProps) {
  const [threadId, setThreadId] = useState(THREADS[0]?.id ?? '');
  const [draft, setDraft] = useState('');
  const thread = THREADS.find((t) => t.id === threadId) ?? THREADS[0];

  return (
    <>
      <ChipRow options={THREADS.map((t) => ({ key: t.id, label: t.name }))} value={threadId} onChange={setThreadId} />
      {thread ? (
        <>
          <Section title={thread.name} icon="message" />
          <Card>
            <Txt size={12} tone="muted">{thread.spec}</Txt>
            <View style={{ marginTop: 12 }}>
              {thread.msgs.map((m, i) => {
                const mine = m.from === 'patient';
                return (
                  <View
                    key={`${i}-${m.text.slice(0, 8)}`}
                    style={{
                      alignSelf: mine ? 'flex-end' : 'flex-start',
                      backgroundColor: mine ? mineral.primary : mineral.primaryLight,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      marginTop: 10,
                      maxWidth: '84%',
                    }}
                  >
                    <Txt size={13} tone={mine ? 'inverse' : 'secondary'}>{m.text}</Txt>
                  </View>
                );
              })}
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <Field value={draft} onChangeText={setDraft} placeholder="Type a message…" />
              </View>
              <Btn
                label="Send"
                onPress={() => { if (draft.trim()) { setDraft(''); toast('Message sent'); } }}
                style={{ width: 88 }}
              />
            </View>
          </Card>
        </>
      ) : null}
    </>
  );
}

// ── Billing ──────────────────────────────────────────────────────────────────

function Billing({ busy }: ScreenProps) {
  return (
    <>
      <Row>
        <Card style={{ flex: 1 }}>
          <Txt size={11} tone="muted">Outstanding</Txt>
          <Txt size={20} weight="700" tone="heading" mono style={{ marginTop: 4 }}>₹0</Txt>
          <Txt size={11} tone="muted">All settled</Txt>
        </Card>
        <Card style={{ flex: 1 }}>
          <Txt size={11} tone="muted">Paid this year</Txt>
          <Txt size={20} weight="700" tone="heading" mono style={{ marginTop: 4 }}>₹1,180</Txt>
          <Txt size={11} tone="muted">{INVOICES.length} invoices</Txt>
        </Card>
      </Row>

      <Section title="Invoice history" icon="billing" />
      {INVOICES.map((inv) => (
        <Card key={inv.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconChip icon="check" color={mineral.statusText.success} bg={mineral.statusBg.success} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Txt size={14} weight="600" tone="heading">{inv.desc}</Txt>
            <Txt size={11} tone="muted" mono>{inv.id} · {inv.date} · {inv.method}</Txt>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Txt size={15} weight="600" tone="heading" mono>{inv.amount}</Txt>
            <Badge>{inv.status}</Badge>
          </View>
          <Pressable
            onPress={() => busy(`Downloading ${inv.id}`, `${inv.id} downloaded`)}
            accessibilityLabel={`Download ${inv.id}`}
            style={{ marginLeft: 10 }}
          >
            <Icon name="download" size={18} color={mineral.primary} />
          </Pressable>
        </Card>
      ))}

      <Btn label="Download statements" variant="outline" icon="download" onPress={() => busy('Preparing statements', 'Statements downloaded')} />

      <Section title="Coverage" icon="shield" />
      <Card>
        {[
          { l: 'Annual Deductible', used: 480, total: 1000, note: '₹520 remaining' },
          { l: 'Out-of-Pocket Max', used: 1180, total: 5000, note: '₹3,820 remaining' },
        ].map((c) => (
          <View key={c.l} style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row' }}>
              <Txt size={13} weight="600" tone="secondary" style={{ flex: 1 }}>{c.l}</Txt>
              <Txt size={12} tone="secondary" mono>₹{c.used} / ₹{c.total}</Txt>
            </View>
            <View style={{ marginTop: 7 }}><Bar pct={(c.used / c.total) * 100} /></View>
            <Txt size={11} tone="muted" style={{ marginTop: 5 }}>{c.note}</Txt>
          </View>
        ))}
      </Card>
    </>
  );
}

// ── Insurance ────────────────────────────────────────────────────────────────

function Insurance({ go, busy }: ScreenProps) {
  return (
    <>
      <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IconChip icon="shield" size={44} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Txt size={15} weight="600" tone="heading">Insurance & Coverage</Txt>
          <Txt size={12} tone="muted">Primary policy holder</Txt>
        </View>
      </Card>

      <Hero style={{ marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Txt size={15} weight="700" tone="inverse" style={{ flex: 1 }}>◆ HealthFirst</Txt>
          <Badge color="#FFFFFF" bg="rgba(255,255,255,0.22)">ACTIVE</Badge>
        </View>
        <Txt size={19} weight="700" tone="inverse" style={{ marginVertical: 16 }}>Premium PPO</Txt>
        <Row>
          {[['Member ID', 'HF-88204517'], ['Group', 'GRP-4471'], ['Valid Thru', '12 / 2026']].map(([k, v]) => (
            <View key={k} style={{ flex: 1 }}>
              <Eyebrow color="#AEE9E0">{k}</Eyebrow>
              <Txt size={13} weight="600" tone="inverse" mono style={{ marginTop: 3 }}>{v}</Txt>
            </View>
          ))}
        </Row>
      </Hero>

      <Section title="Insurance documents" icon="doc" />
      {['Policy Summary 2026', 'Coverage Certificate', 'Claims Form', 'Insurance Card'].map((d) => (
        <ListRow key={d} icon="doc" title={d} subtitle="PDF document" onPress={() => busy(`Opening ${d}`, `${d} ready`)} />
      ))}

      <Section title="Support" icon="message" />
      <Card style={{ alignItems: 'center' }}>
        <IconChip icon="message" size={48} />
        <Txt size={15} weight="600" tone="heading" style={{ marginTop: 12 }}>Insurance support</Txt>
        <Txt size={12} tone="muted" center style={{ marginBottom: 12 }}>Questions about a claim or coverage?</Txt>
        <Btn label="Contact support" variant="outline" onPress={() => go('messages')} />
      </Card>
    </>
  );
}

export const SCREENS: Record<ScreenId, React.ComponentType<ScreenProps>> = {
  home: Dashboard,
  appts: Appointments,
  records: Records,
  meds: Medications,
  lab: LabResults,
  vax: Vaccinations,
  family: Family,
  messages: Messages,
  billing: Billing,
  insurance: Insurance,
};
