import React,{useState} from 'react';
import {Alert,ScrollView,Share,StyleSheet,Text,View} from 'react-native';
import {fontSize as sharedFontSize,fontWeight,palette,radius,spacing} from '@vexoo/shared';
import {useAuth,useTheme} from '../../components/AppContexts';
import {T,alpha} from '../../theme';
import {metricIcon,moduleIcon} from '../../data/icons';
import {
  AppHeader,Button as UiButton,Chip as UiChip,EmptyState,Field,Icon,NavDrawer,PillRow,
  SectionHeader,Sheet as UiSheet,StatGrid,StatTile,Surface,pulseFor,toneFor,type IconName,
} from '../../ui';
import {EQUIPMENT_NAMES,LAB_COMPLETED,LAB_EQUIPMENT,LAB_INVENTORY,LAB_MODULES,LAB_ORDERS,LAB_PROCESSING,LAB_RESULTS,LAB_SAMPLES,SAMPLE_TYPES,TEST_CATALOG,type CompletedTest,type EquipmentItem,type InventoryItem,type LabModuleId,type LabOrder,type ProcessingSample,type Result,type Sample} from '../../data/labTechData';

const accent='#0A7A8F';
const fontSize={...sharedFontSize,xxxl:sharedFontSize.h2};
const now=()=>new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const id=(prefix:string)=>`${prefix}-${Date.now().toString().slice(-5)}`;
function tone(v:string){const s=v.toLowerCase();if(s.includes('stat')||s.includes('critical')||s.includes('out')||s.includes('offline'))return palette.rose;if(s.includes('urgent')||s.includes('pending')||s.includes('low')||s.includes('due')||s.includes('maintenance'))return palette.amber;if(s.includes('normal')||s.includes('online')||s.includes('pass')||s.includes('completed')||s==='ok')return palette.green;return accent;}

/* ── Local primitives ──────────────────────────────────────────────────────
   These keep their original call signatures so the module renderers below are
   untouched, but each now delegates to the shared UI kit — which is where the
   elevation, focus rings, icons and press physics come from. */

function Chip({label}:{label:string}){return <UiChip label={label} tone={toneFor(label)} dot style={s.chipGap}/>}

function Button({label,onPress,ghost=false,danger=false,disabled=false}:{label:string;onPress:()=>void;ghost?:boolean;danger?:boolean;disabled?:boolean}){
  return <UiButton label={label} onPress={onPress} disabled={disabled} accent={accent} style={s.btnGap}
    variant={ghost?'ghost':danger?'danger':'primary'} icon={buttonIcon(label)}/>;
}

function Card({children}:{children:React.ReactNode}){return <Surface style={s.cardGap} radiusSize="xl">{children}</Surface>}

function Section({title,action,onAction}:{title:string;action?:string;onAction?:()=>void}){
  return <SectionHeader title={title} action={action} onAction={onAction} accent={accent}/>;
}

function Input({label,value,onChangeText,placeholder,multiline=false,keyboardType='default'}:{label:string;value:string;onChangeText:(v:string)=>void;placeholder?:string;multiline?:boolean;keyboardType?:'default'|'numeric'}){
  return <Field label={label} value={value} onChangeText={onChangeText} placeholder={placeholder}
    multiline={multiline} keyboardType={keyboardType} accent={accent} containerStyle={s.fieldGap}/>;
}

function Selector({label,items,selected,onChange}:{label:string;items:string[];selected:string;onChange:(v:string)=>void}){
  const{theme}=useTheme();
  return <View style={s.fieldGap}>
    <Text style={[T.label,s.selectorLabel,{color:theme.textMuted}]}>{label}</Text>
    <PillRow options={items.map(x=>({value:x,label:x}))} value={selected} onChange={onChange} accent={accent}/>
  </View>;
}

function Sheet({visible,title,onClose,children}:{visible:boolean;title:string;onClose:()=>void;children:React.ReactNode}){
  return <UiSheet visible={visible} title={title} onClose={onClose}>{children}</UiSheet>;
}

function Empty({text}:{text:string}){return <EmptyState icon="flask" title="Nothing here" message={text} accent={accent}/>}

function Stat({label,value,color=accent}:{label:string;value:string|number;color?:string}){
  return <StatTile label={label} value={value} color={color} icon={metricIcon(label)}/>;
}

/** Picks a leading icon for an action label so buttons aren't bare text. */
function buttonIcon(label:string):IconName|undefined{
  const v=label.toLowerCase();
  if(/accept|confirm|validate|complete|calibrat|mark/.test(v))return'checkCircle';
  if(/barcode|scan/.test(v))return'search';
  if(/add|create|register|new/.test(v))return'plus';
  if(/share/.test(v))return'send';
  if(/start|resume/.test(v))return'activity';
  if(/pause/.test(v))return'clock';
  if(/save/.test(v))return'download';
  if(/sign out|logout/.test(v))return'logout';
  if(/open|enter/.test(v))return'chevronRight';
  return undefined;
}

export default function LabTechPortalScreen(){
 const{user,signOut}=useAuth();const{theme}=useTheme();
 const[module,setModule]=useState<LabModuleId>('dashboard');const[drawer,setDrawer]=useState(false);const[toast,setToast]=useState('');
 const[orders,setOrders]=useState(LAB_ORDERS);const[samples,setSamples]=useState(LAB_SAMPLES);const[processing,setProcessing]=useState(LAB_PROCESSING);const[results,setResults]=useState(LAB_RESULTS);const[completed,setCompleted]=useState(LAB_COMPLETED);const[inventory,setInventory]=useState(LAB_INVENTORY);const[equipment,setEquipment]=useState(LAB_EQUIPMENT);
 const selectModule=(id:LabModuleId)=>{setModule(id);pulseFor(420,'Loading module')};
 const notify=(s:string)=>{setToast(s);setTimeout(()=>setToast(''),2500)};
 const counts:Partial<Record<LabModuleId,number>>={inhouse:orders.filter(x=>x.queue==='inhouse').length,external:orders.filter(x=>x.queue==='external').length,collection:samples.filter(x=>x.status==='Pending').length,processing:processing.filter(x=>x.status!=='Completed').length,results:results.length};
 const titles=Object.fromEntries(LAB_MODULES.map(x=>[x.id,x.label])) as Record<LabModuleId,string>;
 const render=()=>{switch(module){
  case'dashboard':return <Dashboard name={user?.name||'Kevin Liu'} orders={orders} samples={samples} processing={processing} results={results} completed={completed} inventory={inventory} equipment={equipment} nav={selectModule}/>;
  case'inhouse':return <Orders queue="inhouse" orders={orders} setOrders={setOrders} setSamples={setSamples} notify={notify}/>;
  case'external':return <Orders queue="external" orders={orders} setOrders={setOrders} setSamples={setSamples} notify={notify}/>;
  case'collection':return <Collection samples={samples} setSamples={setSamples} setProcessing={setProcessing} notify={notify}/>;
  case'processing':return <Processing rows={processing} setRows={setProcessing} setResults={setResults} notify={notify}/>;
  case'results':return <Results rows={results} setRows={setResults} setCompleted={setCompleted} tech={user?.name||'Kevin Liu'} notify={notify}/>;
  case'completed':return <Completed rows={completed} notify={notify}/>;
  case'inventory':return <Inventory rows={inventory} setRows={setInventory} notify={notify}/>;
  case'equipment':return <Equipment rows={equipment} setRows={setEquipment} notify={notify}/>;
  case'reports':return <Reports completed={completed} processing={processing} orders={orders}/>;
  case'settings':return <Settings name={user?.name||'Kevin Liu'} notify={notify}/>;
 }};
 const name=user?.name||'Kevin Liu';
 return <View style={[s.safe,{backgroundColor:theme.bg}]}>
   <AppHeader
     title={titles[module]}
     subtitle={SUBTITLES[module]}
     roleLabel="Lab Technician"
     userName={name}
     accent={accent}
     modulePill={module==='dashboard'?'Diagnostics workspace':undefined}
     showClock
     onMenu={()=>setDrawer(true)}
   />
   <NavDrawer
     visible={drawer}
     items={LAB_MODULES.map(x=>({id:x.id,label:x.label,icon:moduleIcon(x.label),badge:counts[x.id]}))}
     active={module}
     accent={accent}
     roleLabel="Diagnostics workspace"
     userName={name}
     userEmail={user?.email}
     onClose={()=>setDrawer(false)}
     onSelect={selectModule}
     onSignOut={signOut}
   />
   <ScrollView style={s.flex} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>{render()}</ScrollView>
   {toast?<View style={[s.toast,{backgroundColor:theme.text}]}><Icon name="checkCircle" size={16} color={theme.bg} strokeWidth={2.2}/><Text style={[T.smallStrong,s.toastText,{color:theme.bg}]}>{toast}</Text></View>:null}
 </View>;
}

/** One line of context per module, shown under the header title. */
const SUBTITLES:Record<LabModuleId,string>={
  dashboard:'Live view of the diagnostic pipeline, alerts and workload.',
  inhouse:'Test orders raised by hospital departments.',
  external:'Walk-in and referral orders raised at the lab counter.',
  collection:'Samples awaiting draw, labelling and hand-off.',
  processing:'Analyzer worklist with run state and QC.',
  results:'Measured values awaiting technician validation.',
  completed:'Validated reports ready to share with clinicians.',
  inventory:'Reagents, kits and consumables with reorder levels.',
  equipment:'Analyzer status, load and calibration schedule.',
  reports:'Turnaround, throughput and quality indicators.',
  settings:'Technician profile, alerts and plan.',
};

function Dashboard(p:{name:string;orders:LabOrder[];samples:Sample[];processing:ProcessingSample[];results:Result[];completed:CompletedTest[];inventory:InventoryItem[];equipment:EquipmentItem[];nav:(x:LabModuleId)=>void}){const{theme,mode}=useTheme();return <><View style={[s.hero,{backgroundColor:alpha(accent,mode==='dark'?0.16:0.08),borderColor:alpha(accent,0.22)}]}><Text style={[T.eyebrow,{color:accent}]}>PRECISION IN EVERY RESULT</Text><Text style={[T.h2,s.heroTitle,{color:theme.text}]}>Good shift, {p.name.split(' ')[0]}</Text><Text style={[T.small,{color:theme.textMuted}]}>Your live diagnostic pipeline is ready.</Text></View><StatGrid><Stat label="New orders" value={p.orders.filter(x=>x.status==='New').length}/><Stat label="Awaiting collection" value={p.samples.filter(x=>x.status==='Pending').length} color={palette.amber}/><Stat label="In processing" value={p.processing.filter(x=>x.status!=='Completed').length} color={palette.purple}/><Stat label="Results pending" value={p.results.length} color={palette.rose}/></StatGrid><Section title="Workflow shortcuts"/>{(['inhouse','collection','processing','results'] as LabModuleId[]).map(x=><Card key={x}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x==='inhouse'?'Test Orders':x[0].toUpperCase()+x.slice(1)}</Text><Text style={[s.note,{color:theme.textMuted}]}>Open the live {x} worklist.</Text></View><Button label="Open" onPress={()=>p.nav(x)} ghost/></View></Card>)}<Section title="Operational alerts"/>{p.inventory.filter(x=>x.state!=='OK').map(x=><Card key={x.id}><Text style={[s.cardTitle,{color:theme.text}]}>{x.name}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.stock} {x.unit} remaining</Text><Chip label={x.state}/></Card>)}{p.equipment.filter(x=>x.status!=='Online').map(x=><Card key={x.id}><Text style={[s.cardTitle,{color:theme.text}]}>{x.name}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.nextCalib}</Text><Chip label={x.status}/></Card>)}</>}

function Orders({queue,orders,setOrders,setSamples,notify}:{queue:'inhouse'|'external';orders:LabOrder[];setOrders:React.Dispatch<React.SetStateAction<LabOrder[]>>;setSamples:React.Dispatch<React.SetStateAction<Sample[]>>;notify:(s:string)=>void}){const{theme}=useTheme();const[search,setSearch]=useState('');const[add,setAdd]=useState(false);const[form,setForm]=useState({patient:'',test:TEST_CATALOG[0],priority:'Routine'});const rows=orders.filter(x=>x.queue===queue&&(x.patient.toLowerCase().includes(search.toLowerCase())||x.id.toLowerCase().includes(search.toLowerCase())));const accept=(o:LabOrder)=>{setOrders(a=>a.map(x=>x.id===o.id?{...x,status:'Accepted'}:x));notify(`${o.id} accepted`)};const barcode=(o:LabOrder)=>{const bc=`BC-${Date.now().toString().slice(-5)}`;setSamples(a=>[{orderId:o.id,barcode:bc,patient:o.patient,pid:o.pid,tests:o.tests,doctor:o.doctor,sampleType:o.tests[0].includes('Urine')?'Urine':'Serum',status:'Pending'},...a]);setOrders(a=>a.filter(x=>x.id!==o.id));notify(`Barcode ${bc} generated`)};const create=()=>{if(!form.patient.trim())return Alert.alert('Patient required');setOrders(a=>[{id:id('EXT'),queue:'external',patient:form.patient,pid:id('W'),tests:[form.test],doctor:'Self / Walk-in',department:'Walk-in',priority:form.priority as any,status:'New',time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})},...a]);setAdd(false);notify('External order created')};return <><Input label="Search orders" value={search} onChangeText={setSearch} placeholder="Patient or order ID"/><Section title={queue==='inhouse'?'Hospital orders':'External / walk-in orders'} action={queue==='external'?'+ Add order':`${rows.length} orders`} onAction={queue==='external'?()=>setAdd(true):undefined}/>{rows.map(o=><Card key={o.id}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{o.patient}</Text><Text style={[s.note,{color:theme.textMuted}]}>{o.id} · {o.pid} · {o.time}</Text></View><Chip label={o.priority}/></View><Text style={[s.body,{color:theme.text}]}>{o.tests.join(', ')}</Text><Text style={[s.note,{color:theme.textMuted}]}>{o.doctor} · {o.department}</Text><Chip label={o.status}/><View style={s.actions}>{o.status==='New'?<Button label="Accept" onPress={()=>accept(o)}/>:null}<Button label="Generate barcode" onPress={()=>barcode(o)} ghost={o.status==='New'}/></View></Card>)}{!rows.length?<Empty text="No matching orders."/>:null}<Sheet visible={add} title="New external order" onClose={()=>setAdd(false)}><Input label="Patient name" value={form.patient} onChangeText={patient=>setForm({...form,patient})}/><Selector label="Test" items={TEST_CATALOG} selected={form.test} onChange={test=>setForm({...form,test})}/><Selector label="Priority" items={['Routine','Urgent','STAT']} selected={form.priority} onChange={priority=>setForm({...form,priority})}/><Button label="Create order" onPress={create}/></Sheet></>}

function Collection({samples,setSamples,setProcessing,notify}:{samples:Sample[];setSamples:React.Dispatch<React.SetStateAction<Sample[]>>;setProcessing:React.Dispatch<React.SetStateAction<ProcessingSample[]>>;notify:(s:string)=>void}){const{theme}=useTheme();const collect=(x:Sample)=>{const updated={...x,status:'Collected' as const,collectedAt:now()};setSamples(a=>a.map(y=>y.barcode===x.barcode?updated:y));setProcessing(a=>a.some(y=>y.barcode===x.barcode)?a:[{...updated,status:'Ready',equipment:EQUIPMENT_NAMES[0],qc:'Pending'},...a]);notify('Collection confirmed and sent to processing')};return <><Section title="Collection worklist" action={`${samples.filter(x=>x.status==='Pending').length} pending`}/>{samples.map(x=><Card key={x.barcode}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x.patient}</Text><Text style={[s.mono,{color:accent}]}>{x.barcode}</Text></View><Chip label={x.status}/></View><Text style={[s.body,{color:theme.text}]}>{x.tests.join(', ')}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.sampleType} · {x.pid}</Text>{x.status==='Pending'?<Button label="Confirm collection" onPress={()=>collect(x)}/>:null}</Card>)}</>}

function Processing({rows,setRows,setResults,notify}:{rows:ProcessingSample[];setRows:React.Dispatch<React.SetStateAction<ProcessingSample[]>>;setResults:React.Dispatch<React.SetStateAction<Result[]>>;notify:(s:string)=>void}){const{theme}=useTheme();const change=(x:ProcessingSample,status:ProcessingSample['status'])=>{setRows(a=>a.map(y=>y.barcode===x.barcode?{...y,status,qc:status==='Completed'?'Pass':y.qc}:y));if(status==='Completed')setResults(a=>a.some(y=>y.id===x.orderId)?a:[{id:x.orderId,patient:x.patient,pid:x.pid,tests:x.tests,doctor:x.doctor,values:Object.fromEntries(x.tests.map(t=>[t,''])),flag:'Normal',remarks:''},...a]);notify(status==='Completed'?'Processing complete; results ready':`Sample ${status.toLowerCase()}`)};return <><Section title="Analyzer worklist" action={`${rows.length} samples`}/>{rows.map(x=><Card key={x.barcode}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x.patient}</Text><Text style={[s.mono,{color:accent}]}>{x.barcode}</Text></View><Chip label={x.status}/></View><Text style={[s.body,{color:theme.text}]}>{x.tests.join(', ')}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.equipment} · QC {x.qc}</Text><View style={s.actions}>{x.status==='Ready'?<Button label="Start" onPress={()=>change(x,'Running')}/>:null}{x.status==='Running'?<Button label="Pause" onPress={()=>change(x,'Paused')} ghost/>:null}{x.status==='Paused'?<Button label="Resume" onPress={()=>change(x,'Running')}/>:null}{x.status!=='Completed'?<Button label="Complete" onPress={()=>change(x,'Completed')}/>:null}</View></Card>)}</>}

function Results({rows,setRows,setCompleted,tech,notify}:{rows:Result[];setRows:React.Dispatch<React.SetStateAction<Result[]>>;setCompleted:React.Dispatch<React.SetStateAction<CompletedTest[]>>;tech:string;notify:(s:string)=>void}){const{theme}=useTheme();const[selected,setSelected]=useState<Result|null>(null);const save=()=>{if(!selected)return;setRows(a=>a.map(x=>x.id===selected.id?selected:x));notify('Draft result saved')};const submit=()=>{if(!selected)return;setCompleted(a=>[{id:selected.id,patient:selected.patient,pid:selected.pid,tests:selected.tests,doctor:selected.doctor,completed:now(),outcome:selected.flag,validatedBy:tech},...a]);setRows(a=>a.filter(x=>x.id!==selected.id));setSelected(null);notify('Result validated and completed')};return <><Section title="Results awaiting validation" action={`${rows.length} pending`}/>{rows.map(x=><Card key={x.id}><Text style={[s.cardTitle,{color:theme.text}]}>{x.patient}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.id} · {x.tests.join(', ')}</Text><Chip label={x.flag}/><Button label="Enter results" onPress={()=>setSelected({...x,values:{...x.values}})}/></Card>)}{!rows.length?<Empty text="All results have been validated."/>:null}<Sheet visible={!!selected} title="Enter & validate result" onClose={()=>setSelected(null)}>{selected?<>{selected.tests.map(t=><React.Fragment key={t}><Input label={t} value={selected.values[t]||''} onChangeText={v=>setSelected({...selected,values:{...selected.values,[t]:v}})} placeholder="Measured value / summary"/></React.Fragment>)}<Selector label="Result flag" items={['Normal','Abnormal','Critical']} selected={selected.flag} onChange={flag=>setSelected({...selected,flag:flag as Result['flag']})}/><Input label="Remarks" value={selected.remarks} onChangeText={remarks=>setSelected({...selected,remarks})} multiline/><View style={s.actions}><Button label="Save draft" onPress={save} ghost/><Button label="Validate & submit" onPress={submit}/></View></>:null}</Sheet></>}

function Completed({rows,notify}:{rows:CompletedTest[];notify:(s:string)=>void}){const{theme}=useTheme();const share=async(x:CompletedTest)=>{await Share.share({title:`Lab report ${x.id}`,message:`Vexoo Lab Report\n${x.patient} (${x.pid})\n${x.tests.join(', ')}\nOutcome: ${x.outcome}\nValidated by: ${x.validatedBy}`});notify('Report share opened')};return <><Section title="Completed tests" action={`${rows.length} records`}/>{rows.map(x=><Card key={`${x.id}-${x.completed}`}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x.patient}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.id} · {x.completed}</Text></View><Chip label={x.outcome}/></View><Text style={[s.body,{color:theme.text}]}>{x.tests.join(', ')}</Text><Text style={[s.note,{color:theme.textMuted}]}>Validated by {x.validatedBy}</Text><Button label="Share report" onPress={()=>share(x)} ghost/></Card>)}</>}

function Inventory({rows,setRows,notify}:{rows:InventoryItem[];setRows:React.Dispatch<React.SetStateAction<InventoryItem[]>>;notify:(s:string)=>void}){const{theme}=useTheme();const[open,setOpen]=useState(false);const[form,setForm]=useState({name:'',stock:'',category:'Reagents'});const add=()=>{if(!form.name||!form.stock)return Alert.alert('Complete required fields');setRows(a=>[{id:id('INV'),name:form.name,category:form.category,batch:id('B'),stock:Number(form.stock),unit:'units',reorder:10,expiry:'12 Jul 2027',state:Number(form.stock)<10?'Low':'OK'},...a]);setOpen(false);notify('Inventory item added')};return <><View style={s.grid}><Stat label="Items" value={rows.length}/><Stat label="Low / out" value={rows.filter(x=>x.state==='Low'||x.state==='Out').length} color={palette.rose}/></View><Section title="Lab inventory" action="+ Add item" onAction={()=>setOpen(true)}/>{rows.map(x=><Card key={x.id}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x.name}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.category} · Batch {x.batch}</Text></View><Chip label={x.state}/></View><Text style={[s.body,{color:theme.text}]}>{x.stock} {x.unit} · reorder at {x.reorder}</Text><Text style={[s.note,{color:theme.textMuted}]}>Expires {x.expiry}</Text></Card>)}<Sheet visible={open} title="Add inventory item" onClose={()=>setOpen(false)}><Input label="Item name" value={form.name} onChangeText={name=>setForm({...form,name})}/><Input label="Opening stock" value={form.stock} onChangeText={stock=>setForm({...form,stock})} keyboardType="numeric"/><Selector label="Category" items={['Reagents','Test Kits','Chemicals','Glassware','Consumables']} selected={form.category} onChange={category=>setForm({...form,category})}/><Button label="Add item" onPress={add}/></Sheet></>}

function Equipment({rows,setRows,notify}:{rows:EquipmentItem[];setRows:React.Dispatch<React.SetStateAction<EquipmentItem[]>>;notify:(s:string)=>void}){const{theme}=useTheme();const[open,setOpen]=useState(false);const[name,setName]=useState('');const add=()=>{if(!name)return;setRows(a=>[{id:id('EQ'),name,model:'New device',status:'Online',load:'0%',nextCalib:'12 Aug 2026',uptime:'100%'},...a]);setOpen(false);notify('Equipment registered')};return <><Section title="Equipment monitoring" action="+ Register" onAction={()=>setOpen(true)}/>{rows.map(x=><Card key={x.id}><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>{x.name}</Text><Text style={[s.note,{color:theme.textMuted}]}>{x.model} · {x.id}</Text></View><Chip label={x.status}/></View><Text style={[s.body,{color:theme.text}]}>Load {x.load} · Uptime {x.uptime}</Text><Text style={[s.note,{color:theme.textMuted}]}>Next calibration: {x.nextCalib}</Text>{x.status==='Calibration Due'?<Button label="Mark calibrated" onPress={()=>{setRows(a=>a.map(y=>y.id===x.id?{...y,status:'Online',nextCalib:'12 Aug 2026'}:y));notify('Calibration recorded')}}/>:null}</Card>)}<Sheet visible={open} title="Register equipment" onClose={()=>setOpen(false)}><Input label="Equipment name" value={name} onChangeText={setName}/><Button label="Register" onPress={add}/></Sheet></>}

function Reports({completed,processing,orders}:{completed:CompletedTest[];processing:ProcessingSample[];orders:LabOrder[]}){const{theme}=useTheme();const total=completed.length+processing.length+orders.length;const abnormal=completed.filter(x=>x.outcome!=='Normal').length;const bars=[{l:'Completed',v:completed.length,c:palette.green},{l:'Processing',v:processing.filter(x=>x.status!=='Completed').length,c:palette.purple},{l:'Pending',v:orders.length,c:palette.amber}];return <><View style={s.grid}><Stat label="Total workload" value={total}/><Stat label="Completed" value={completed.length} color={palette.green}/><Stat label="Abnormal" value={abnormal} color={palette.rose}/><Stat label="Avg TAT" value="34m" color={palette.purple}/></View><Section title="Pipeline distribution"/>{bars.map(x=><View key={x.l} style={s.barRow}><Text style={[s.barLabel,{color:theme.text}]}>{x.l}</Text><View style={[s.barTrack,{backgroundColor:theme.border}]}><View style={[s.bar,{backgroundColor:x.c,width:`${Math.max(8,(x.v/Math.max(total,1))*100)}%`}]} /></View><Text style={[s.note,{color:theme.textMuted}]}>{x.v}</Text></View>)}<Section title="Quality indicators"/><Card><Text style={[s.cardTitle,{color:theme.text}]}>Quality control pass rate</Text><Text style={[s.bigNumber,{color:palette.green}]}>98.7%</Text><Text style={[s.note,{color:theme.textMuted}]}>Target ≥ 97% · Rejection rate 1.1%</Text></Card></>}

function Settings({name,notify}:{name:string;notify:(s:string)=>void}){const{theme}=useTheme();const[profile,setProfile]=useState({name,email:'kevin.l@hospital.vexoo.in',phone:'+91 98765 43230',section:'Clinical Pathology',shift:'Morning'});const[notif,setNotif]=useState(true);return <><Section title="Technician profile"/><Card><Input label="Full name" value={profile.name} onChangeText={name=>setProfile({...profile,name})}/><Input label="Email" value={profile.email} onChangeText={email=>setProfile({...profile,email})}/><Input label="Phone" value={profile.phone} onChangeText={phone=>setProfile({...profile,phone})}/><Selector label="Section" items={['Clinical Pathology','Hematology','Biochemistry','Microbiology']} selected={profile.section} onChange={section=>setProfile({...profile,section})}/><Selector label="Shift" items={['Morning','Evening','Night']} selected={profile.shift} onChange={shift=>setProfile({...profile,shift})}/><Button label="Save profile" onPress={()=>notify('Profile saved')}/></Card><Section title="Preferences"/><Card><View style={s.row}><View style={{flex:1}}><Text style={[s.cardTitle,{color:theme.text}]}>Critical result alerts</Text><Text style={[s.note,{color:theme.textMuted}]}>Immediate in-app notifications</Text></View><Button label={notif?'On':'Off'} onPress={()=>setNotif(!notif)} ghost/></View></Card><Section title="Hospital plan"/><Card><Text style={[s.cardTitle,{color:theme.text}]}>Core plan</Text><Text style={[s.bigNumber,{color:accent}]}>INR 24,000</Text><Text style={[s.note,{color:theme.textMuted}]}>Active · Renews 11 Aug 2026 · Lab included</Text></Card></>}

const s=StyleSheet.create({
  safe:{flex:1},
  flex:{flex:1},
  content:{paddingBottom:spacing.huge,paddingHorizontal:spacing.xl,paddingTop:spacing.sm},

  // Dashboard hero — a tinted accent band rather than another white card.
  hero:{borderRadius:radius.xl,borderWidth:StyleSheet.hairlineWidth*2,marginTop:spacing.xl,padding:spacing.xl},
  heroTitle:{marginBottom:spacing.xs,marginTop:spacing.sm},

  grid:{flexDirection:'row',flexWrap:'wrap',gap:spacing.md},

  // Card interior text
  cardTitle:{...T.title},
  body:{...T.subtitle,marginTop:spacing.sm},
  note:{...T.caption,marginTop:3},
  mono:{...T.mono,marginTop:4},

  row:{alignItems:'center',flexDirection:'row',gap:spacing.md},
  actions:{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm,marginTop:spacing.md},

  // Spacing hooks for the kit-backed primitives
  chipGap:{marginTop:spacing.sm},
  btnGap:{marginTop:spacing.sm},
  cardGap:{marginBottom:spacing.md},
  fieldGap:{marginTop:spacing.lg},
  selectorLabel:{marginBottom:spacing.sm},

  // Reports bars
  barRow:{alignItems:'center',flexDirection:'row',gap:spacing.md,marginBottom:spacing.md},
  barLabel:{...T.captionStrong,width:82},
  barTrack:{borderRadius:radius.pill,flex:1,height:10,overflow:'hidden'},
  bar:{borderRadius:radius.pill,height:'100%'},
  bigNumber:{...T.numeral,marginVertical:spacing.sm},

  toast:{alignItems:'center',borderRadius:radius.lg,bottom:28,flexDirection:'row',gap:spacing.sm,left:spacing.xl,paddingHorizontal:spacing.lg,paddingVertical:spacing.md,position:'absolute',right:spacing.xl},
  toastText:{flex:1},
});
