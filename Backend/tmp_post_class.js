const http = require('http');
(async ()=>{
  try{
    const payload = JSON.stringify({class_name:'class 2',section:'A',grade:'10',roomNumber:'12',capacity:34,teacherId:'ee828698-c329-4950-8243-7e328a1580d3'});
    const res = await fetch('http://localhost:3000/classes', {method:'POST', headers:{'Content-Type':'application/json'}, body: payload});
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log('BODY', text);
  }catch(e){ console.error('ERR', e); process.exit(1);} 
})();
