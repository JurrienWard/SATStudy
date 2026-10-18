import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, BookOpen,
  Bookmark, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, Compass, ExternalLink, FileText, Flame,
  GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Play, Plus, Search,
  Settings, ShieldCheck, Sparkles, Target, TrendingUp, Trophy, X, Zap,
  Brain, RotateCcw, CircleDot, Filter, ListChecks, NotebookPen
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import './styles.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const STORE = 'northstar-sat-state-v1'

const curriculum = [
  { section:'Math', domain:'Algebra', weight:'~35%', color:'violet', topics:[
    'Linear equations in one variable','Linear equations in two variables','Linear functions','Systems of two linear equations','Linear inequalities'
  ]},
  { section:'Math', domain:'Advanced Math', weight:'~35%', color:'blue', topics:[
    'Equivalent expressions','Nonlinear equations in one variable','Systems of nonlinear equations','Nonlinear functions','Quadratic equations','Exponential functions'
  ]},
  { section:'Math', domain:'Problem-Solving and Data Analysis', weight:'~15%', color:'green', topics:[
    'Ratios, rates and proportions','Percentages','Units and conversions','One-variable data','Two-variable data','Probability','Statistical claims'
  ]},
  { section:'Math', domain:'Geometry and Trigonometry', weight:'~15%', color:'orange', topics:[
    'Area and volume','Lines, angles and triangles','Right triangles and trigonometry','Circles'
  ]},
  { section:'Reading & Writing', domain:'Information and Ideas', weight:'~26%', color:'pink', topics:[
    'Central ideas and details','Command of evidence: textual','Command of evidence: quantitative','Inferences'
  ]},
  { section:'Reading & Writing', domain:'Craft and Structure', weight:'~28%', color:'purple', topics:[
    'Words in context','Text structure and purpose','Cross-text connections'
  ]},
  { section:'Reading & Writing', domain:'Expression of Ideas', weight:'~20%', color:'cyan', topics:[
    'Rhetorical synthesis','Transitions'
  ]},
  { section:'Reading & Writing', domain:'Standard English Conventions', weight:'~26%', color:'yellow', topics:[
    'Boundaries and sentence structure','Form, structure and sense','Punctuation'
  ]}
]

const questions = [
 {id:'m1',section:'Math',domain:'Algebra',topic:'Linear equations in one variable',difficulty:'Easy',prompt:'A music service charges a fixed £6 fee plus £2 per downloaded album. If the total is £20, how many albums were downloaded?',options:['5','7','8','10'],answer:1,explanation:'Let a be the number of albums. 6 + 2a = 20, so 2a = 14 and a = 7.'},
 {id:'m2',section:'Math',domain:'Algebra',topic:'Systems of two linear equations',difficulty:'Medium',prompt:'If x + y = 11 and x − y = 3, what is the value of x?',options:['4','7','8','14'],answer:2,explanation:'Add the equations: 2x = 14, so x = 7. Correction: the listed answer should be 7; choose the second option.',fixAnswer:1},
 {id:'m3',section:'Math',domain:'Advanced Math',topic:'Quadratic equations',difficulty:'Medium',prompt:'Which value is a solution to x² − 5x + 6 = 0?',options:['1','2','4','6'],answer:1,explanation:'Factor the expression: (x − 2)(x − 3) = 0. The solutions are 2 and 3, so 2 is listed.'},
 {id:'m4',section:'Math',domain:'Problem-Solving and Data Analysis',topic:'Percentages',difficulty:'Easy',prompt:'A jacket priced at £80 is discounted by 15%. What is the sale price?',options:['£12','£65','£68','£72'],answer:2,explanation:'15% of 80 is 0.15 × 80 = 12. Subtract the discount: £80 − £12 = £68.'},
 {id:'m5',section:'Math',domain:'Geometry and Trigonometry',topic:'Area and volume',difficulty:'Easy',prompt:'A rectangle has a length of 12 cm and a width of 5 cm. What is its area?',options:['17 cm²','34 cm²','60 cm²','120 cm²'],answer:2,explanation:'Area of a rectangle = length × width = 12 × 5 = 60 cm².'},
 {id:'m6',section:'Math',domain:'Advanced Math',topic:'Exponential functions',difficulty:'Medium',prompt:'A population is 200 and doubles every 3 hours. Which expression gives its size after t hours?',options:['200 + 2t','200(2)^(t/3)','200(t/3)²','2(200)^(t/3)'],answer:1,explanation:'There are t/3 doubling periods. Starting at 200, the population is 200 × 2^(t/3).'},
 {id:'m7',section:'Math',domain:'Algebra',topic:'Linear functions',difficulty:'Medium',prompt:'A line has slope 4 and passes through (2, 3). Which equation represents it?',options:['y = 4x − 5','y = 4x + 5','y = 2x − 1','y = 3x + 4'],answer:0,explanation:'Use y − y₁ = m(x − x₁): y − 3 = 4(x − 2), giving y = 4x − 5.'},
 {id:'m8',section:'Math',domain:'Problem-Solving and Data Analysis',topic:'Ratios, rates and proportions',difficulty:'Easy',prompt:'A recipe uses 3 cups of flour for 8 muffins. At the same rate, how many cups are needed for 24 muffins?',options:['6','8','9','12'],answer:2,explanation:'24 muffins is 3 times 8, so multiply flour by 3: 3 × 3 = 9 cups.'},
 {id:'m9',section:'Math',domain:'Geometry and Trigonometry',topic:'Right triangles and trigonometry',difficulty:'Medium',prompt:'A right triangle has legs of lengths 6 and 8. What is the hypotenuse?',options:['7','10','12','14'],answer:1,explanation:'By the Pythagorean theorem, c² = 6² + 8² = 100, so c = 10.'},
 {id:'m10',section:'Math',domain:'Problem-Solving and Data Analysis',topic:'Probability',difficulty:'Easy',prompt:'A bag contains 4 red, 3 blue and 5 green counters. If one is chosen at random, what is the probability it is blue?',options:['1/4','1/3','3/5','5/12'],answer:0,explanation:'There are 12 counters in total and 3 are blue, so the probability is 3/12 = 1/4.'},
 {id:'r1',section:'Reading & Writing',domain:'Information and Ideas',topic:'Central ideas and details',difficulty:'Easy',prompt:'Passage: “After the city added protected bike lanes, the number of residents commuting by bicycle rose steadily over two years. Surveys also found that more residents described cycling as a practical way to travel.” Which choice best states the passage’s central idea?',options:['Cycling is always faster than driving.','Protected bike lanes were associated with increased cycling and more positive views of it.','Most residents already cycled before the lanes were added.','The city plans to remove its bike lanes.'],answer:1,explanation:'The passage reports a rise in cycling and more favourable survey responses after protected lanes were introduced. It does not claim cycling is always faster or discuss removing lanes.'},
 {id:'r2',section:'Reading & Writing',domain:'Craft and Structure',topic:'Words in context',difficulty:'Medium',prompt:'In the sentence “The scientist’s findings were tentative, so the team avoided making a definitive claim,” what does “tentative” most nearly mean?',options:['Certain','Preliminary','Irrelevant','Widely accepted'],answer:1,explanation:'The contrast with “definitive claim” signals that the findings are preliminary or not yet conclusive.'},
 {id:'r3',section:'Reading & Writing',domain:'Standard English Conventions',topic:'Boundaries and sentence structure',difficulty:'Easy',prompt:'Choose the option that correctly completes the sentence: “The experiment was repeated three times, ___ the results remained consistent.”',options:['however','and','although,','because,'],answer:1,explanation:'“And” joins two related independent clauses with a comma before the conjunction.'},
 {id:'r4',section:'Reading & Writing',domain:'Expression of Ideas',topic:'Transitions',difficulty:'Medium',prompt:'“The first model was inexpensive to build. ___, it consumed too much energy to be practical.” Which transition best completes the sentence?',options:['For example','Similarly','However','Therefore'],answer:2,explanation:'The second sentence contrasts with the first, so “However” is the best transition.'},
 {id:'r5',section:'Reading & Writing',domain:'Information and Ideas',topic:'Inferences',difficulty:'Medium',prompt:'Passage: “Mira usually worked in the library, but on Thursday she chose a café because the library was closed for maintenance.” What can most reasonably be inferred?',options:['Mira dislikes libraries.','The café is always quieter than the library.','Mira needed another place to work that Thursday.','The library will close permanently.'],answer:2,explanation:'The passage directly supports that Mira chose an alternative place because her usual location was unavailable.'},
 {id:'r6',section:'Reading & Writing',domain:'Standard English Conventions',topic:'Punctuation',difficulty:'Easy',prompt:'Which sentence uses the apostrophe correctly?',options:['The students project was displayed.','The student’s project was displayed.','The students’ project’s was displayed.','The student,s project was displayed.'],answer:1,explanation:'“Student’s” uses an apostrophe to show that the project belongs to one student.'},
 {id:'r7',section:'Reading & Writing',domain:'Craft and Structure',topic:'Text structure and purpose',difficulty:'Medium',prompt:'A passage describes two competing explanations for a historical event and then presents evidence favouring one. What is the passage’s main organisational approach?',options:['Narrating a fictional story','Comparing explanations and evaluating evidence','Listing instructions in chronological order','Describing a place without argument'],answer:1,explanation:'The passage compares explanations and weighs evidence to support one of them.'},
 {id:'r8',section:'Reading & Writing',domain:'Expression of Ideas',topic:'Rhetorical synthesis',difficulty:'Medium',prompt:'Notes: • A local museum opened in 1924. • It now offers free entry on Sundays. • Sunday attendance increased by 30% after the policy began. Which sentence best uses the notes to show a result of the policy?',options:['The museum opened in 1924.','The museum has a Sunday policy.','After the museum introduced free Sunday entry, Sunday attendance rose by 30%.','Museums are important community spaces.'],answer:2,explanation:'This option accurately connects the policy with the reported attendance increase without adding unsupported claims.'},
 {id:'r9',section:'Reading & Writing',domain:'Information and Ideas',topic:'Command of evidence: quantitative',difficulty:'Medium',prompt:'A survey found that 40 of 50 students preferred quiet study spaces. Which statement is best supported?',options:['Exactly 80% of surveyed students preferred quiet study spaces.','All students prefer quiet study spaces.','Students study better in silence in every situation.','Only 10 students completed the survey.'],answer:0,explanation:'40 ÷ 50 = 0.8, which is 80%. The result applies to the surveyed group, not all students.'},
 {id:'r10',section:'Reading & Writing',domain:'Craft and Structure',topic:'Cross-text connections',difficulty:'Hard',prompt:'Text 1 argues that city trees lower summer temperatures. Text 2 agrees but notes that young trees need years of care before providing substantial shade. How would the author of Text 2 most likely respond to Text 1?',options:['By rejecting all tree-planting projects','By agreeing with the benefit while adding a practical qualification','By claiming temperatures never change','By arguing that shade is harmful'],answer:1,explanation:'Text 2 accepts the central benefit but qualifies how quickly the benefit appears and what maintenance is required.'}
]
// Correct a deliberately caught editorial key before displaying question bank.
questions.find(q=>q.id==='m2').answer = 1

const resources = [
 {name:'Khan Academy — Digital SAT',type:'Lessons and practice',url:'https://www.khanacademy.org/digital-sat',desc:'Free guided lessons, videos, quizzes and skill practice.'},
 {name:'College Board — Student Question Bank',type:'Official question bank',url:'https://satsuite.collegeboard.org/practice/student-question-bank',desc:'Filter official questions by section, domain, skill and difficulty.'},
 {name:'Bluebook — Official practice tests',type:'Full-length tests',url:'https://bluebook.collegeboard.org/students/practice',desc:'Take digital practice tests in the official testing app.'},
 {name:'SAT Suite — Test structure',type:'Exam information',url:'https://satsuite.collegeboard.org/sat/whats-on-the-test',desc:'Review the current test sections, domains and question types.'},
 {name:'Desmos Graphing Calculator',type:'Calculator',url:'https://www.desmos.com/calculator',desc:'Explore graphs, intersections, functions and equations.'},
 {name:'College Board — SAT practice',type:'Official preparation',url:'https://satsuite.collegeboard.org/practice',desc:'Official guidance and preparation resources.'}
]

const initialState = {
 profile:{goal:1400,examDate:'',weeklyHours:7,name:''},
 completed:[],
 attempts:[],
 mistakes:[],
 sessions:[],
 notes:{},
 plan:[
  {id:'p1',day:'Monday',task:'Math: review one weak topic',minutes:30,done:false},
  {id:'p2',day:'Tuesday',task:'Reading & Writing practice',minutes:30,done:false},
  {id:'p3',day:'Wednesday',task:'Review mistake notebook',minutes:20,done:false},
  {id:'p4',day:'Thursday',task:'Math targeted questions',minutes:30,done:false},
  {id:'p5',day:'Friday',task:'Grammar and transitions',minutes:25,done:false},
  {id:'p6',day:'Saturday',task:'Mixed timed practice',minutes:45,done:false},
  {id:'p7',day:'Sunday',task:'Reflect and plan next week',minutes:20,done:false}
 ]
}

function readLocal(){try{return {...initialState,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{return initialState}}
function uid(){return Math.random().toString(36).slice(2,10)}
function percent(a,b){return b?Math.round(a/b*100):0}
function formatDate(d){return new Date(d).toLocaleDateString(undefined,{day:'numeric',month:'short'})}
function App(){
 const [data,setData] = useState(readLocal)
 const [page,setPage] = useState('Dashboard')
 const [section,setSection] = useState('All')
 const [query,setQuery] = useState('')
 const [domainFilter,setDomainFilter] = useState('All topics')
 const [difficulty,setDifficulty] = useState('All')
 const [activeQuestion,setActiveQuestion] = useState(null)
 const [chosen,setChosen] = useState({})
 const [revealed,setRevealed] = useState({})
 const [showAuth,setShowAuth] = useState(false)
 const [email,setEmail] = useState('')
 const [password,setPassword] = useState('')
 const [authMode,setAuthMode] = useState('signin')
 const [user,setUser] = useState(null)
 const [syncStatus,setSyncStatus] = useState(supabase?'Cloud sync not connected':'Local demo mode')
 const [sidebarOpen,setSidebarOpen] = useState(false)
 const [toast,setToast] = useState('')
 const [plannerDraft,setPlannerDraft] = useState('')
 const [newNote,setNewNote] = useState('')
 const [activeTab,setActiveTab] = useState('All')
 const [profileDraft,setProfileDraft] = useState(data.profile)

 useEffect(()=>{localStorage.setItem(STORE,JSON.stringify(data))},[data])
 useEffect(()=>{
   if(!supabase)return
   supabase.auth.getSession().then(({data:{session}})=>{if(session){setUser(session.user);loadCloud(session.user.id)}})
   const {data:listener}=supabase.auth.onAuthStateChange((_event,session)=>{
     setUser(session?.user||null)
     if(session?.user) loadCloud(session.user.id)
     else setSyncStatus('Cloud sync not connected')
   })
   return ()=>listener.subscription.unsubscribe()
 },[])
 async function loadCloud(id){
   const {data:row,error}=await supabase.from('study_state').select('payload').eq('user_id',id).maybeSingle()
   if(error){setSyncStatus('Cloud sync error');return}
   if(row?.payload){setData({...initialState,...row.payload});setSyncStatus('Synced to cloud')}
   else {setSyncStatus('Ready to sync');}
 }
 async function saveCloud(next){
   if(!supabase||!user)return
   setSyncStatus('Syncing…')
   const {error}=await supabase.from('study_state').upsert({user_id:user.id,payload:next,updated_at:new Date().toISOString()})
   setSyncStatus(error?'Cloud sync error':'Synced to cloud')
 }
 function update(patch){
   setData(prev=>{
     const next={...prev,...(typeof patch==='function'?patch(prev):patch)}
     localStorage.setItem(STORE,JSON.stringify(next))
     saveCloud(next)
     return next
   })
 }
 function notify(s){setToast(s);setTimeout(()=>setToast(''),2600)}
 async function authSubmit(e){
   e.preventDefault()
   if(!supabase){notify('Add Supabase settings to enable cloud accounts.');return}
   const result=authMode==='signup'
    ? await supabase.auth.signUp({email,password})
    : await supabase.auth.signInWithPassword({email,password})
   if(result.error){notify(result.error.message);return}
   if(result.data.user){setUser(result.data.user);await loadCloud(result.data.user.id);setShowAuth(false);notify(authMode==='signup'?'Account created. Check email if confirmation is required.':'Signed in successfully.')}
 }
 async function signOut(){if(supabase)await supabase.auth.signOut();setUser(null);setSyncStatus('Local demo mode');notify('Signed out. Your local copy remains on this device.')}
 const topics = useMemo(()=>curriculum.flatMap(d=>d.topics.map(t=>({topic:t,domain:d.domain,section:d.section,weight:d.weight,color:d.color}))),[])
 const attempts = data.attempts||[]
 const totalAnswered=attempts.length
 const accuracy=percent(attempts.filter(a=>a.correct).length,totalAnswered)
 const mathAttempts=attempts.filter(a=>a.section==='Math')
 const rwAttempts=attempts.filter(a=>a.section==='Reading & Writing')
 const avgSection=(arr)=>arr.length?percent(arr.filter(a=>a.correct).length,arr.length):0
 const streak = data.sessions.length?Math.min(7,data.sessions.length):0
 const topicStats = useMemo(()=>topics.map(t=>{
   const a=attempts.filter(x=>x.topic===t.topic)
   return {...t,seen:a.length,accuracy:percent(a.filter(x=>x.correct).length,a.length)}
 }),[attempts])
 const weakTopics=topicStats.filter(t=>t.seen).sort((a,b)=>a.accuracy-b.accuracy).slice(0,4)
 const filteredQuestions=questions.filter(q=>(section==='All'||q.section===section)&&(domainFilter==='All topics'||q.domain===domainFilter)&&(difficulty==='All'||q.difficulty===difficulty)&&(!query||`${q.prompt} ${q.topic} ${q.domain}`.toLowerCase().includes(query.toLowerCase())))
 const startPractice=(q=null)=>{
   setActiveQuestion(q?.id||null);setChosen({});setRevealed({})
   if(q){setPage('Practice');setTimeout(()=>document.getElementById('practice-area')?.scrollIntoView({behavior:'smooth'}),100)}
 }
 const submitAnswer=(q)=>{
   if(chosen[q.id]===undefined)return
   const right=chosen[q.id]=== (q.fixAnswer??q.answer)
   const attempt={id:uid(),questionId:q.id,topic:q.topic,domain:q.domain,section:q.section,correct:right,chosen:chosen[q.id],answer:q.fixAnswer??q.answer,date:new Date().toISOString()}
   update(prev=>{
     const mistakes=right?prev.mistakes:[{...attempt,prompt:q.prompt,explanation:q.explanation,reviewDate:new Date(Date.now()+86400000).toISOString().slice(0,10),resolved:false},...prev.mistakes.filter(m=>m.questionId!==q.id||m.resolved)]
     return {attempts:[...prev.attempts,attempt],mistakes,sessions:prev.sessions.includes(new Date().toISOString().slice(0,10))?prev.sessions:[...prev.sessions,new Date().toISOString().slice(0,10)]}
   })
   setRevealed(p=>({...p,[q.id]:true}))
 }
 const markTopic=(topic)=>{
   update(prev=>({completed:prev.completed.includes(topic)?prev.completed.filter(t=>t!==topic):[...prev.completed,topic]}))
 }
 const addPlanTask=()=>{
   if(!plannerDraft.trim())return
   update(prev=>({plan:[...prev.plan,{id:uid(),day:'Saturday',task:plannerDraft.trim(),minutes:30,done:false}]}))
   setPlannerDraft('');notify('Study task added')
 }
 const togglePlan=id=>update(prev=>({plan:prev.plan.map(p=>p.id===id?{...p,done:!p.done}:p)}))
 const addNote=()=>{
   if(!newNote.trim())return
   update(prev=>({notes:{...prev.notes,[uid()]:{text:newNote.trim(),date:new Date().toISOString()}}}))
   setNewNote('');notify('Note saved')
 }
 const markMistake=(id)=>update(prev=>({mistakes:prev.mistakes.map(m=>m.id===id?{...m,resolved:!m.resolved}:m)}))
 const deleteMistake=(id)=>update(prev=>({mistakes:prev.mistakes.filter(m=>m.id!==id)}))
 const nav=[
  {label:'Dashboard',icon:LayoutDashboard},{label:'Learn',icon:BookOpen},{label:'Practice',icon:Zap},
  {label:'Mistakes',icon:NotebookPen},{label:'Study planner',icon:CalendarDays},{label:'Progress',icon:BarChart3},
  {label:'Resources',icon:Compass}
 ]
 const navTo=n=>{setPage(n);setSidebarOpen(false)}
 const completedPct=percent(data.completed.length,topics.length)
 const chartData=useMemo(()=>{
   const days=[]
   for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10)
    const todays=attempts.filter(a=>a.date.slice(0,10)===key)
    days.push({day:d.toLocaleDateString(undefined,{weekday:'short'}),accuracy:todays.length?percent(todays.filter(a=>a.correct).length,todays.length):0,questions:todays.length})
   }
   return days
 },[attempts])
 const recommend=weakTopics[0]||topicStats.find(t=>!data.completed.includes(t.topic))||topics[0]
 const dueMistakes=data.mistakes.filter(m=>!m.resolved&&m.reviewDate<=new Date().toISOString().slice(0,10)).length

 return <div className="app-shell">
   <aside className={`sidebar ${sidebarOpen?'open':''}`}>
    <div className="brand"><div className="brand-mark"><Compass size={20}/></div><div><b>northstar<span>.</span></b><small>SAT STUDY SPACE</small></div><button className="icon-btn mobile-close" onClick={()=>setSidebarOpen(false)}><X size={18}/></button></div>
    <div className="workspace-label">WORKSPACE</div>
    <nav>{nav.map(n=>{const Icon=n.icon;return <button key={n.label} className={`nav-item ${page===n.label?'active':''}`} onClick={()=>navTo(n.label)}><Icon size={18}/><span>{n.label}</span>{n.label==='Mistakes'&&dueMistakes>0&&<i className="nav-count">{dueMistakes}</i>}</button>})}</nav>
    <div className="sidebar-bottom">
      <div className="goal-card"><div className="goal-icon"><Target size={18}/></div><div className="goal-title">Your target score</div><div className="goal-score">{data.profile.goal}<span> / 1600</span></div><div className="goal-bar"><i style={{width:`${Math.min(100,data.profile.goal/16)}%`}}/></div><button onClick={()=>navTo('Progress')}>View progress <ArrowRight size={13}/></button></div>
      <div className="sidebar-user"><div className="avatar">{(user?.email||data.profile.name||'S').slice(0,1).toUpperCase()}</div><div className="user-label"><b>{user?.email?.split('@')[0]||data.profile.name||'SAT learner'}</b><small>{user?'Cloud account':'Local study profile'}</small></div><button className="icon-btn" title="Settings" onClick={()=>navTo('Settings')}><Settings size={17}/></button></div>
    </div>
   </aside>
   {sidebarOpen&&<div className="scrim" onClick={()=>setSidebarOpen(false)}/>}
   <main className="main-area">
    <header className="topbar">
      <button className="icon-btn mobile-menu" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
      <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/><b>{page}</b></div>
      <div className="top-actions"><div className={`sync-pill ${user?'online':''}`}><span/>{user?(syncStatus==='Synced to cloud'?'Cloud synced':syncStatus):supabase?'Cloud sync available':'Local mode'}</div><button className="top-avatar" onClick={()=>setShowAuth(true)} title="Account">{user?<Check size={17}/>:<ShieldCheck size={17}/>}</button></div>
    </header>
    <div className="page-content">
     {page==='Dashboard'&&<Dashboard data={data} attempts={attempts} accuracy={accuracy} totalAnswered={totalAnswered} completedPct={completedPct} topics={topics} weakTopics={weakTopics} recommend={recommend} dueMistakes={dueMistakes} chartData={chartData} navTo={navTo} startPractice={startPractice} togglePlan={togglePlan} />}
     {page==='Learn'&&<Learn curriculum={curriculum} completed={data.completed} markTopic={markTopic} notes={data.notes} update={update} notify={notify}/>}
     {page==='Practice'&&<Practice questions={filteredQuestions} allQuestions={questions} section={section} setSection={setSection} domainFilter={domainFilter} setDomainFilter={setDomainFilter} difficulty={difficulty} setDifficulty={setDifficulty} query={query} setQuery={setQuery} activeQuestion={activeQuestion} chosen={chosen} setChosen={setChosen} revealed={revealed} submitAnswer={submitAnswer} startPractice={startPractice} />}
     {page==='Mistakes'&&<Mistakes mistakes={data.mistakes} markMistake={markMistake} deleteMistake={deleteMistake} startPractice={startPractice}/>}
     {page==='Study planner'&&<Planner plan={data.plan} togglePlan={togglePlan} plannerDraft={plannerDraft} setPlannerDraft={setPlannerDraft} addPlanTask={addPlanTask} profile={data.profile} update={update}/>}
     {page==='Progress'&&<Progress attempts={attempts} accuracy={accuracy} totalAnswered={totalAnswered} topicStats={topicStats} completedPct={completedPct} chartData={chartData} profile={data.profile}/>}
     {page==='Resources'&&<Resources resources={resources}/>}
     {page==='Settings'&&<SettingsPage data={data} setData={setData} profileDraft={profileDraft} setProfileDraft={setProfileDraft} update={update} user={user} supabase={supabase} syncStatus={syncStatus} setShowAuth={setShowAuth} signOut={signOut} notify={notify}/>}
    </div>
    <footer className="footer"><span>Northstar SAT <i>·</i> Independent study project</span><span>Free tools. Your pace. Your progress.</span></footer>
   </main>
   {showAuth&&<div className="modal-backdrop" onClick={()=>setShowAuth(false)}><div className="modal auth-modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-btn" onClick={()=>setShowAuth(false)}><X size={18}/></button><div className="modal-symbol"><ShieldCheck size={22}/></div><h2>{user?'Your account':'Sync across devices'}</h2><p>{user?'Your study progress can sync through your private account.':'Connect a free Supabase account to keep your progress available on your other devices.'}</p>{!supabase?<div className="notice"><CircleHelp size={18}/><div><b>Cloud sync needs setup</b><span>Follow the README to create a free Supabase project and add your environment variables, then rebuild and deploy.</span></div></div>:user?<><div className="account-row"><div className="avatar">{user.email?.slice(0,1).toUpperCase()}</div><div><b>{user.email}</b><small>{syncStatus}</small></div></div><button className="btn btn-secondary full" onClick={signOut}><LogOut size={16}/> Sign out</button></>:<form onSubmit={authSubmit} className="auth-form"><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" required minLength="6" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/></label><button className="btn btn-primary full" type="submit">{authMode==='signup'?'Create free account':'Sign in'} <ArrowRight size={16}/></button><button className="text-btn" type="button" onClick={()=>setAuthMode(authMode==='signup'?'signin':'signup')}>{authMode==='signup'?'Already have an account? Sign in':'New here? Create an account'}</button></form>}<div className="privacy-note"><ShieldCheck size={14}/> Your data is private to your account when RLS is configured.</div></div></div>}
   {toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}</div>}
 </div>
}

function PageHeading({eyebrow,title,description,action}){return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>}
function StatCard({icon:Icon,label,value,sub,trend,tone='violet'}){return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{trend&&<span className="trend"><ArrowUpRight size={13}/>{trend}</span>}{sub}</div></div>}
function Dashboard({data,attempts,accuracy,totalAnswered,completedPct,topics,weakTopics,recommend,dueMistakes,chartData,navTo,startPractice,togglePlan}){
 const nextTasks=data.plan.filter(p=>!p.done).slice(0,3)
 return <><PageHeading eyebrow="YOUR STUDY OVERVIEW" title={`Welcome back${data.profile.name?', '+data.profile.name:''} 👋`} description="Small, consistent sessions add up. Here's where your SAT prep stands today." action={<button className="btn btn-primary" onClick={()=>navTo('Practice')}><Play size={16} fill="currentColor"/> Start practice</button>}/>
 <div className="hero-banner"><div className="hero-copy"><div className="hero-kicker"><Sparkles size={14}/> YOUR NEXT BEST STEP</div><h2>{recommend?.topic||'Start with your first topic'}</h2><p>{recommend?.seen?`You've answered ${recommend.seen} question${recommend.seen===1?'':'s'} here with ${recommend.accuracy}% accuracy. Build confidence with a focused practice set.`:'Start learning a topic, then use practice questions to find your strengths and gaps.'}</p><button className="btn btn-light" onClick={()=>recommend&&startPractice(questions.find(q=>q.topic===recommend.topic)||null)}>Continue learning <ArrowRight size={16}/></button></div><div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-ring"><Target size={62}/><span>FOCUS</span></div><div className="float-tag"><Zap size={14}/> One step at a time</div></div></div>
 <div className="stats-grid"><StatCard icon={Target} label="Practice accuracy" value={`${accuracy}%`} sub={`${totalAnswered} answers recorded`} tone="violet"/><StatCard icon={BookOpen} label="Topics completed" value={`${data.completed.length}/${topics.length}`} sub={`${completedPct}% of curriculum`} tone="blue"/><StatCard icon={Flame} label="Study sessions" value={data.sessions.length} sub="Days with practice" tone="orange"/><StatCard icon={NotebookPen} label="Reviews due" value={dueMistakes} sub="Mistakes to revisit" tone="pink"/></div>
 <div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-heading"><div><h3>Practice activity</h3><p>Your answers over the last 7 days</p></div><button className="subtle-btn" onClick={()=>navTo('Progress')}>Full report <ArrowRight size={14}/></button></div><div className="chart-legend"><span><i className="legend-dot purple-dot"/> Accuracy</span><span><i className="legend-dot blue-dot"/> Questions answered</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{top:10,right:8,left:-24,bottom:0}}><defs><linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9b8cff" stopOpacity={0.25}/><stop offset="100%" stopColor="#9b8cff" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#263047" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="day" tick={{fill:'#8e99b1',fontSize:12}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#8e99b1',fontSize:11}} axisLine={false} tickLine={false} domain={[0,100]}/><Tooltip contentStyle={{background:'#151d30',border:'1px solid #303a52',borderRadius:10,color:'#eef1fb'}} formatter={(v,n)=>[n==='accuracy'?`${v}%`:v,n==='accuracy'?'Accuracy':'Questions answered']}/><Area type="monotone" dataKey="accuracy" stroke="#a69aff" strokeWidth={2.5} fill="url(#accuracyFill)" /></AreaChart></ResponsiveContainer></div></div>
 <div className="panel focus-panel"><div className="panel-heading"><div><h3>Focus areas</h3><p>Topics worth another look</p></div><Brain size={18} className="muted-icon"/></div>{weakTopics.length?weakTopics.slice(0,3).map((t,i)=><div className="focus-item" key={t.topic}><div className={`focus-number n${i+1}`}>{String(i+1).padStart(2,'0')}</div><div className="focus-main"><b>{t.topic}</b><small>{t.domain}</small><div className="mini-progress"><i style={{width:`${t.accuracy}%`}}/></div></div><div className="focus-pct">{t.accuracy}%</div></div>):<div className="empty-state compact"><div className="empty-icon"><Target/></div><b>Your focus list starts here</b><p>Answer a few practice questions and we'll highlight topics to revisit.</p><button className="text-btn" onClick={()=>navTo('Practice')}>Try practice <ArrowRight size={14}/></button></div>}<button className="btn btn-secondary full" onClick={()=>navTo('Learn')}>Explore curriculum <ArrowRight size={15}/></button></div></div>
 <div className="lower-grid"><div className="panel plan-panel"><div className="panel-heading"><div><h3>This week's plan</h3><p>Keep it realistic and consistent</p></div><button className="subtle-btn" onClick={()=>navTo('Study planner')}>View plan <ArrowRight size={14}/></button></div>{nextTasks.length?nextTasks.map(p=><label className="task-row" key={p.id}><input type="checkbox" checked={p.done} onChange={()=>togglePlan(p.id)}/><span className="task-check"><Check size={12}/></span><span className="task-copy"><b>{p.task}</b><small>{p.day}</small></span><span className="task-time"><Clock3 size={13}/>{p.minutes}m</span></label>):<div className="success-note"><CheckCircle2 size={18}/> Your current plan is complete. Nice work!</div>}</div><div className="panel quick-panel"><div className="panel-heading"><div><h3>Quick links</h3><p>Jump back into your routine</p></div></div><button className="quick-link" onClick={()=>navTo('Learn')}><div className="quick-icon blue"><BookOpen size={17}/></div><span><b>Browse lessons</b><small>{topics.length-data.completed.length} topics remaining</small></span><ChevronRight size={17}/></button><button className="quick-link" onClick={()=>navTo('Mistakes')}><div className="quick-icon pink"><RotateCcw size={17}/></div><span><b>Review mistakes</b><small>{dueMistakes} due for review</small></span><ChevronRight size={17}/></button><button className="quick-link" onClick={()=>navTo('Resources')}><div className="quick-icon green"><Compass size={17}/></div><span><b>Free resources</b><small>Official tools and lessons</small></span><ChevronRight size={17}/></button></div></div>
 </>}
function Learn({curriculum,completed,markTopic,notes,update,notify}){
 const [expanded,setExpanded]=useState('Algebra')
 const [filter,setFilter]=useState('All')
 const [search,setSearch]=useState('')
 const [noteTopic,setNoteTopic]=useState(null)
 const [noteValue,setNoteValue]=useState('')
 const groups=curriculum.filter(g=>(filter==='All'||g.section===filter)&&(`${g.domain} ${g.topics.join(' ')}`.toLowerCase().includes(search.toLowerCase())))
 const all=curriculum.flatMap(g=>g.topics)
 return <><PageHeading eyebrow="YOUR CURRICULUM" title="Learn the skills" description="A structured map of SAT topics. Check off what you've learned and use free lessons to build each skill."/><div className="learn-summary"><div><div className="learn-summary-icon"><GraduationCap size={21}/></div><div><b>{completed.length} of {all.length} topics completed</b><p>Move through the curriculum at your own pace.</p></div></div><div className="summary-progress"><b>{percent(completed.length,all.length)}%</b><div className="progress-track"><i style={{width:`${percent(completed.length,all.length)}%`}}/></div></div></div>
 <div className="filter-row"><div className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search topics…"/></div><div className="segmented">{['All','Math','Reading & Writing'].map(x=><button className={filter===x?'selected':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div>
 <div className="curriculum-list">{groups.map(g=>{const done=g.topics.filter(t=>completed.includes(t)).length;const open=expanded===g.domain;return <div className={`domain-card ${open?'expanded':''}`} key={g.domain}><button className="domain-head" onClick={()=>setExpanded(open?'':g.domain)}><div className={`domain-icon ${g.color}`}><BookOpen size={19}/></div><div className="domain-info"><div className="domain-title-row"><h3>{g.domain}</h3><span className="domain-weight">{g.weight} of section</span></div><p>{g.section} <i>·</i> {done}/{g.topics.length} topics complete</p><div className="domain-progress"><i style={{width:`${percent(done,g.topics.length)}%`}}/></div></div><ChevronDown className={open?'rotate':''} size={18}/></button>{open&&<div className="topic-list">{g.topics.filter(t=>t.toLowerCase().includes(search.toLowerCase())).map((t,i)=>{const isDone=completed.includes(t);return <div className="topic-row" key={t}><button className={`topic-check ${isDone?'checked':''}`} onClick={()=>markTopic(t)}>{isDone?<Check size={14}/>:<span/>}</button><div className="topic-copy"><b className={isDone?'finished':''}>{t}</b><small>{isDone?'Marked complete':'Lesson and targeted practice'}</small></div><button className="topic-note-btn" title="Add a study note" onClick={()=>{setNoteTopic(t);setNoteValue(notes?.[t]||'')}}><NotebookPen size={15}/></button><a className="topic-link" href="https://www.khanacademy.org/digital-sat" target="_blank" rel="noreferrer">Study <ExternalLink size={13}/></a></div>})}</div>}</div>})}</div>
 {noteTopic&&<div className="modal-backdrop" onClick={()=>setNoteTopic(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-btn" onClick={()=>setNoteTopic(null)}><X size={18}/></button><div className="eyebrow">STUDY NOTES</div><h2>{noteTopic}</h2><p>Write a reminder, formula or concept to revisit.</p><textarea className="notes-area" value={noteValue} onChange={e=>setNoteValue(e.target.value)} placeholder="Key idea, worked example, or question…"/><button className="btn btn-primary full" onClick={()=>{update(prev=>({notes:{...prev.notes,[noteTopic]:noteValue}}));setNoteTopic(null);notify('Study note saved')}}>Save note <Check size={15}/></button></div></div>}
 </>}
function Practice({questions,allQuestions,section,setSection,domainFilter,setDomainFilter,difficulty,setDifficulty,query,setQuery,activeQuestion,chosen,setChosen,revealed,submitAnswer,startPractice}){
 const [mode,setMode]=useState(activeQuestion?'single':'browse')
 const [sessionIds,setSessionIds]=useState([])
 const [index,setIndex]=useState(0)
 const [sessionDone,setSessionDone]=useState(false)
 const [sessionAnswers,setSessionAnswers]=useState({})
 const [sessionRevealed,setSessionRevealed]=useState({})
 const domains=[...new Set(allQuestions.map(q=>q.domain))]
 const q=activeQuestion?allQuestions.find(x=>x.id===activeQuestion):null
 const beginSession=()=>{const shuffled=[...questions].sort(()=>Math.random()-.5).slice(0,Math.min(5,questions.length));setSessionIds(shuffled.map(x=>x.id));setIndex(0);setSessionDone(false);setSessionAnswers({});setSessionRevealed({});setMode('session')}
 const sq=allQuestions.find(x=>x.id===sessionIds[index])
 const sessionScore=Object.entries(sessionRevealed).filter(([id])=>sessionIds.includes(id)).filter(([id])=>{const qq=allQuestions.find(x=>x.id===id);return sessionAnswers[id]===(qq?.fixAnswer??qq?.answer)}).length
 return <><PageHeading eyebrow="PRACTICE CENTRE" title="Practice with purpose" description="Build confidence with original starter questions. Use the filters to focus on one skill or start a short mixed session." action={<button className="btn btn-primary" onClick={beginSession}><Zap size={16}/> Start 5-question set</button>}/>
 {mode==='session'?<div className="practice-session panel" id="practice-area">{sessionDone?<div className="session-result"><div className="result-medal"><Trophy size={32}/></div><div className="eyebrow">SESSION COMPLETE</div><h2>Good work showing up.</h2><p>You answered {sessionIds.length} original practice questions. Use the explanations to decide what to review next.</p><div className="result-score"><b>{sessionScore}/{sessionIds.length}</b><span>correct answers</span></div><button className="btn btn-primary" onClick={()=>{setMode('browse');setSessionDone(false)}}>Back to practice <ArrowRight size={16}/></button></div>:sq?<><div className="session-top"><div><span className="session-label">MIXED PRACTICE</span><h2>Question {index+1} <span>of {sessionIds.length}</span></h2></div><button className="subtle-btn" onClick={()=>setMode('browse')}>Exit session <X size={14}/></button></div><div className="session-progress"><i style={{width:`${(index+1)/sessionIds.length*100}%`}}/></div><QuestionCard q={sq} chosen={sessionAnswers} setChosen={setSessionAnswers} revealed={sessionRevealed} onSubmit={q=>{if(sessionAnswers[q.id]===undefined)return;setSessionRevealed(p=>({...p,[q.id]:true}))}}/><div className="session-nav">{index>0?<button className="btn btn-secondary" onClick={()=>setIndex(i=>i-1)}><ChevronLeft size={16}/> Previous</button>:<span/>}{sessionRevealed[sq.id]&&<button className="btn btn-primary" onClick={()=>index===sessionIds.length-1?setSessionDone(true):setIndex(i=>i+1)}>{index===sessionIds.length-1?'Finish session':'Next question'} <ArrowRight size={16}/></button>}</div></>:null}</div>:<><div className="practice-intro"><div className="practice-intro-icon"><Zap size={23}/></div><div><b>Original practice questions</b><p>These are independent starter questions, not official SAT items. For authentic SAT questions, use the College Board question bank.</p></div><a href="https://satsuite.collegeboard.org/practice/student-question-bank" target="_blank" rel="noreferrer" className="subtle-btn">Official questions <ExternalLink size={14}/></a></div><div className="practice-toolbar"><div className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search questions or topics…"/></div><select value={section} onChange={e=>setSection(e.target.value)}><option>All</option><option>Math</option><option>Reading & Writing</option></select><select value={domainFilter} onChange={e=>setDomainFilter(e.target.value)}><option>All topics</option>{domains.map(d=><option key={d}>{d}</option>)}</select><select value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div><div className="practice-count"><span>{questions.length} questions found</span><span>Answer explanations included</span></div><div className="question-grid">{questions.map(q=><div className="question-tile" key={q.id}><div className="question-meta"><span className={`section-chip ${q.section==='Math'?'math-chip':'rw-chip'}`}>{q.section==='Math'?'MATH':'READING & WRITING'}</span><span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span></div><h3>{q.topic}</h3><p>{q.prompt}</p><div className="question-tile-bottom"><span><CircleDot size={13}/>{q.domain}</span><button className="btn btn-secondary btn-small" onClick={()=>{setActiveQuestion(q.id);setMode('single');setChosen({});setRevealed({})}}>Solve <ArrowRight size={14}/></button></div></div>)}</div>{questions.length===0&&<div className="empty-state"><Search size={25}/><b>No questions match those filters</b><p>Try another topic or clear your search.</p></div>}{mode==='single'&&activeQuestion&&<div className="modal-backdrop" onClick={()=>setMode('browse')}><div className="modal question-modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-btn" onClick={()=>setMode('browse')}><X size={18}/></button><QuestionCard q={q} chosen={chosen} setChosen={setChosen} revealed={revealed} onSubmit={submitAnswer}/></div></div>}</>}
 </>}
function QuestionCard({q,chosen,setChosen,revealed,onSubmit}){
 if(!q)return null
 const selected=chosen[q.id],isRevealed=!!revealed[q.id],answer=q.fixAnswer??q.answer
 return <div className="question-card"><div className="question-meta"><span className={`section-chip ${q.section==='Math'?'math-chip':'rw-chip'}`}>{q.section}</span><span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span><span className="question-domain">{q.domain}</span></div><h3>{q.prompt}</h3><div className="answer-options">{q.options.map((o,i)=><button key={i} disabled={isRevealed} className={`answer-option ${selected===i?'selected':''} ${isRevealed&&i===answer?'correct':''} ${isRevealed&&selected===i&&i!==answer?'incorrect':''}`} onClick={()=>setChosen(p=>({...p,[q.id]:i}))}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{o}</span>{isRevealed&&i===answer&&<CheckCircle2 size={17}/>}</button>)}</div>{isRevealed?<div className={`explanation-box ${selected===answer?'right':'wrong'}`}><div className="explanation-heading">{selected===answer?<CheckCircle2 size={17}/>:<CircleHelp size={17}/>} {selected===answer?'Correct answer':'Let’s learn from this'}</div><p>{q.explanation}</p></div>:<button className="btn btn-primary" disabled={selected===undefined} onClick={()=>onSubmit(q)}>Check answer <ArrowRight size={16}/></button>}</div>
}
function Mistakes({mistakes,markMistake,deleteMistake,startPractice}){
 const [filter,setFilter]=useState('Open')
 const filtered=mistakes.filter(m=>filter==='All'||(filter==='Open'&&!m.resolved)||(filter==='Reviewed'&&m.resolved))
 return <><PageHeading eyebrow="LEARN FROM EVERY MISS" title="Mistake notebook" description="Wrong answers are useful data. Review the reasoning, then try the skill again later." action={<div className="mistake-count"><b>{mistakes.filter(m=>!m.resolved).length}</b><span>open reviews</span></div>}/><div className="mistake-summary"><div><div className="mistake-summary-icon"><RotateCcw size={21}/></div><div><b>Turn mistakes into progress</b><p>Revisit a question after a delay, explain the correct method in your own words, then practise a similar skill.</p></div></div><div className="segmented">{['Open','Reviewed','All'].map(x=><button className={filter===x?'selected':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div></div><div className="mistake-list">{filtered.map(m=><div className={`mistake-card ${m.resolved?'resolved':''}`} key={m.id}><div className="mistake-card-top"><span className={`section-chip ${m.section==='Math'?'math-chip':'rw-chip'}`}>{m.section}</span><span className="mistake-date">{m.resolved?'Reviewed':`Review ${m.reviewDate<=new Date().toISOString().slice(0,10)?'due':formatDate(m.reviewDate)}`}</span></div><h3>{m.topic}</h3><p className="mistake-prompt">{m.prompt}</p><div className="mistake-explanation"><b>Key idea</b><p>{m.explanation}</p></div><div className="mistake-actions"><button className="btn btn-secondary btn-small" onClick={()=>markMistake(m.id)}>{m.resolved?<RotateCcw size={14}/>:<Check size={14}/>} {m.resolved?'Reopen review':'Mark reviewed'}</button><button className="subtle-btn" onClick={()=>deleteMistake(m.id)}>Remove</button></div></div>)}</div>{filtered.length===0&&<div className="empty-state panel"><div className="empty-icon"><NotebookPen/></div><h3>{filter==='Open'?'No open mistakes yet':'Nothing in this view yet'}</h3><p>When you miss an answer in practice, it will appear here with an explanation and a review date.</p><button className="btn btn-primary" onClick={()=>startPractice()}>Start practising <ArrowRight size={15}/></button></div>}</>
}
function Planner({plan,togglePlan,plannerDraft,setPlannerDraft,addPlanTask,profile,update}){
 const [dayFilter,setDayFilter]=useState('All days')
 const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
 const filtered=plan.filter(p=>dayFilter==='All days'||p.day===dayFilter)
 const done=plan.filter(p=>p.done).length
 const minutes=plan.filter(p=>!p.done).reduce((s,p)=>s+Number(p.minutes||0),0)
 return <><PageHeading eyebrow="MAKE A PLAN YOU CAN KEEP" title="Study planner" description="A flexible plan beats a perfect plan you never follow. Start small and adapt it to your week."/><div className="planner-overview"><div className="planner-overview-main"><div className="eyebrow">WEEKLY OVERVIEW</div><h2>{done} of {plan.length} tasks complete</h2><p>{minutes} minutes remaining in your current plan</p><div className="big-progress"><i style={{width:`${percent(done,plan.length)}%`}}/></div></div><div className="planner-metric"><CalendarDays size={20}/><b>{profile.weeklyHours}</b><span>target hours / week</span></div><div className="planner-metric"><Clock3 size={20}/><b>{Math.round(minutes/60*10)/10}h</b><span>planned time left</span></div></div><div className="planner-controls"><div className="segmented">{['All days',...days].map(x=><button className={dayFilter===x?'selected':''} onClick={()=>setDayFilter(x)} key={x}>{x}</button>)}</div><div className="add-task"><input value={plannerDraft} onChange={e=>setPlannerDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlanTask()} placeholder="Add a study task…"/><button className="btn btn-primary btn-small" onClick={addPlanTask}><Plus size={15}/> Add task</button></div></div><div className="planner-tasks">{filtered.map(p=><div className={`planner-task ${p.done?'done':''}`} key={p.id}><button className={`task-check-button ${p.done?'checked':''}`} onClick={()=>togglePlan(p.id)}>{p.done?<Check size={14}/>:null}</button><div className="planner-day">{p.day.slice(0,3).toUpperCase()}</div><div className="planner-task-copy"><b>{p.task}</b><small>{p.done?'Completed — nice work':'Study session'}</small></div><span className="task-time"><Clock3 size={13}/>{p.minutes} min</span></div>)}</div><div className="planner-tip"><Sparkles size={18}/><div><b>Make the plan fit your life</b><p>Short sessions are useful. If a task feels too large, split it into a lesson, a few practice questions and a brief review.</p></div></div></>
}
function Progress({attempts,accuracy,totalAnswered,topicStats,completedPct,chartData,profile}){
 const domainStats=[...new Set(topicStats.map(t=>t.domain))].map(d=>{const ts=topicStats.filter(t=>t.domain===d);const a=attempts.filter(x=>x.domain===d);return {domain:d,seen:a.length,accuracy:percent(a.filter(x=>x.correct).length,a.length),completed:ts.filter(t=>t.seen&&t.accuracy>=80).length,total:ts.length}})
 return <><PageHeading eyebrow="YOUR PROGRESS, NOT JUST A SCORE" title="Progress & insights" description="Use trends to decide what to practise next. This dashboard tracks your activity; it does not estimate an official SAT score."/><div className="stats-grid progress-stats"><StatCard icon={Target} label="Overall accuracy" value={`${accuracy}%`} sub={`${totalAnswered} questions attempted`} tone="violet"/><StatCard icon={BookOpen} label="Curriculum complete" value={`${completedPct}%`} sub={`${topicStats.filter(t=>t.seen&&t.accuracy>=80).length} topics at 80%+ accuracy`} tone="blue"/><StatCard icon={Activity} label="Math attempts" value={attempts.filter(a=>a.section==='Math').length} sub={`${percent(attempts.filter(a=>a.section==='Math'&&a.correct).length,attempts.filter(a=>a.section==='Math').length)}% accuracy`} tone="green"/><StatCard icon={Brain} label="Reading & Writing" value={attempts.filter(a=>a.section==='Reading & Writing').length} sub={`${percent(attempts.filter(a=>a.section==='Reading & Writing'&&a.correct).length,attempts.filter(a=>a.section==='Reading & Writing').length)}% accuracy`} tone="pink"/></div><div className="panel chart-panel large-chart"><div className="panel-heading"><div><h3>Accuracy over time</h3><p>Daily accuracy across the last week (days without attempts show 0)</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="progressFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67d7bd" stopOpacity={0.22}/><stop offset="100%" stopColor="#67d7bd" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#263047" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="day" tick={{fill:'#8e99b1',fontSize:12}} axisLine={false} tickLine={false}/><YAxis domain={[0,100]} tick={{fill:'#8e99b1',fontSize:11}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#151d30',border:'1px solid #303a52',borderRadius:10,color:'#eef1fb'}} formatter={v=>[`${v}%`,'Accuracy']}/><Area dataKey="accuracy" stroke="#67d7bd" strokeWidth={2.5} fill="url(#progressFill)"/></AreaChart></ResponsiveContainer></div></div><div className="panel domain-progress-panel"><div className="panel-heading"><div><h3>Performance by domain</h3><p>Only attempted questions are included in accuracy.</p></div></div>{domainStats.map(d=><div className="performance-row" key={d.domain}><div className="performance-label"><b>{d.domain}</b><small>{d.seen} attempts</small></div><div className="performance-track"><i style={{width:`${d.accuracy}%`}}/></div><b className="performance-value">{d.seen?`${d.accuracy}%`:'—'}</b></div>)}</div><div className="score-note"><ShieldCheck size={19}/><div><b>About SAT scores</b><p>These percentages describe your answers in this app only. The short starter bank is not calibrated to the real SAT, and adaptive scoring means a raw percentage cannot reliably predict your 400–1600 score. Use Bluebook for official practice-test scoring.</p><a href="https://bluebook.collegeboard.org/students/practice" target="_blank" rel="noreferrer">Official practice tests <ExternalLink size={13}/></a></div></div></>
}
function Resources({resources}){return <><PageHeading eyebrow="FREE TOOLS, ALL IN ONE PLACE" title="Resource library" description="Use these free resources for real SAT preparation. Northstar organises your work; these tools provide official practice and teaching content."/><div className="resource-banner"><div className="resource-banner-icon"><Compass size={24}/></div><div><b>Free does not mean low quality</b><p>The official College Board tools are essential for realistic exam practice. Use this dashboard to plan and review around them.</p></div></div><div className="resource-grid">{resources.map((r,i)=><a className="resource-card" href={r.url} target="_blank" rel="noreferrer" key={r.name}><div className={`resource-icon tone-${i%4}`}>{[BookOpen,FileText,GraduationCap,Target,Activity,Compass][i]({size:20})}</div><div className="resource-type">{r.type}</div><h3>{r.name}</h3><p>{r.desc}</p><span className="resource-open">Open resource <ExternalLink size={14}/></span></a>)}</div><div className="original-content-note"><ShieldCheck size={18}/><div><b>Content and copyright</b><p>The included question bank is independently written for this project. Official questions stay on College Board's own platform; this app links to them instead of copying them.</p></div></div></>}
function SettingsPage({data,setData,profileDraft,setProfileDraft,update,user,supabase,syncStatus,setShowAuth,signOut,notify}){
 const [exported,setExported]=useState(false)
 function saveProfile(e){e.preventDefault();update({profile:{...data.profile,...profileDraft}});notify('Profile settings saved')}
 function exportData(){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='northstar-sat-backup.json';a.click();URL.revokeObjectURL(url);setExported(true);setTimeout(()=>setExported(false),2000)}
 function importData(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);setData({...initialState,...parsed});notify('Study backup imported')}catch{notify('That file is not a valid Northstar backup')}};reader.readAsText(file)}
 return <><PageHeading eyebrow="YOUR STUDY SPACE" title="Settings" description="Customise your goal, protect your data and manage cross-device sync."/><div className="settings-layout"><form className="panel settings-panel" onSubmit={saveProfile}><div className="panel-heading"><div><h3>Study profile</h3><p>Set a goal that motivates you.</p></div><Settings size={19} className="muted-icon"/></div><label className="form-field">Display name<input value={profileDraft.name||''} onChange={e=>setProfileDraft(p=>({...p,name:e.target.value}))} placeholder="What should we call you?"/></label><label className="form-field">Target SAT score<select value={profileDraft.goal} onChange={e=>setProfileDraft(p=>({...p,goal:Number(e.target.value)}))}>{[1000,1100,1200,1300,1400,1450,1500,1550,1600].map(n=><option key={n} value={n}>{n}</option>)}</select></label><label className="form-field">Exam date<input type="date" value={profileDraft.examDate||''} onChange={e=>setProfileDraft(p=>({...p,examDate:e.target.value}))}/></label><label className="form-field">Target study hours per week<input type="number" min="1" max="40" value={profileDraft.weeklyHours} onChange={e=>setProfileDraft(p=>({...p,weeklyHours:Number(e.target.value)}))}/></label><button className="btn btn-primary" type="submit">Save preferences <Check size={15}/></button></form><div className="settings-side"><div className="panel settings-panel"><div className="panel-heading"><div><h3>Cloud sync</h3><p>Keep your progress across devices.</p></div><ShieldCheck size={19} className="muted-icon"/></div><div className="cloud-status"><span className={user?'status-green':''}/><div><b>{user?'Connected':supabase?'Not connected':'Not configured'}</b><small>{user?user.email:supabase?'Sign in to sync your data':'Add free Supabase settings to enable accounts'}</small></div></div>{user?<button className="btn btn-secondary full" onClick={signOut}><LogOut size={15}/> Sign out</button>:<button className="btn btn-primary full" onClick={()=>setShowAuth(true)}>{supabase?'Sign in or create account':'How to enable cloud sync'} <ArrowRight size={15}/></button>}</div><div className="panel settings-panel"><div className="panel-heading"><div><h3>Backup & restore</h3><p>Keep a portable copy of your progress.</p></div><FileText size={19} className="muted-icon"/></div><p className="settings-copy">Export your progress, planner, mistakes and notes as a JSON file. Store it somewhere safe.</p><button className="btn btn-secondary full" onClick={exportData}><ArrowDownRight size={15}/>{exported?'Backup downloaded':'Export study backup'}</button><label className="btn btn-secondary full import-label"><ArrowUpRight size={15}/> Import backup<input type="file" accept="application/json,.json" onChange={importData}/></label></div><div className="privacy-box"><ShieldCheck size={19}/><div><b>Your data, your control</b><p>Local mode stores data in this browser. Cloud mode uses your Supabase project and row-level security. Never publish your database service-role key.</p></div></div></div></div></>}
createRoot(document.getElementById('root')).render(<App/>)
