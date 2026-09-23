<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue';
</script>




<template>
  <div class="wrap">
    <header>

    
      <Header />
    
    </header>

    <RouterView />
    <Footer />
  </div>
</template>





<style>
:root{
    --bg:#0f172a;
    --card:#1e293b;
    --accent:#38bdf8;
    --accent2:#a78bfa;
    --text:#e2e8f0;
    --muted:#94a3b8;
    --border:#334155;
    --danger:#f87171;
  }
  *{box-sizing:border-box; line-height: 1.6;}
  body{
    margin:0;
    min-height:100vh;
    background:linear-gradient(160deg,#0f172a,#1e1b4b);
    font-family:"Tahoma","Segoe UI",Arial,sans-serif;
    color:var(--text);
    display:flex;
    justify-content:center;
    padding:32px 16px;
  }
  .wrap{width:100%;max-width:640px;}
  h1{
    text-align:center;
    font-size:1.5rem;
    margin-bottom:4px;
    background:linear-gradient(90deg,var(--accent),var(--accent2));
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
  }
  p.sub{text-align:center;color:var(--muted);margin-top:0;margin-bottom:24px;font-size:.9rem;}
  .card{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:16px;
    padding:24px;
    margin-bottom:20px;
    box-shadow:0 10px 30px rgba(0,0,0,.3);
  }
  .system-tabs{
    display:flex;
    gap:8px;
    margin-bottom:20px;
    flex-wrap:wrap;
  }
  .system-tabs label{
    flex:1;
    min-width:140px;
    text-align:center;
    padding:10px 8px;
    border:1px solid var(--border);
    border-radius:10px;
    cursor:pointer;
    font-size:.9rem;
    transition:.15s;
    user-select:none;
  }
  .system-tabs input{display:none;}
.system-tabs label.active-tab {
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  border-color: transparent;
  font-weight: bold;
  color: #0f172a;
}
  .fields{
    display:grid;
    grid-template-columns:1fr 1.4fr 1fr;
    gap:12px;
  }
  .field label span{
    display:block;
    font-size:.8rem;
    color:var(--muted);
    margin-bottom:6px;
  }
  input[type=number], select{
    width:100%;
    padding:10px;
    border-radius:8px;
    border:1px solid var(--border);
    background:#0f172a;
    color:var(--text);
    font-size:1rem;
    text-align:center;
  }
  select{text-align:right;padding-right:10px;}
  input[type=number]:focus, select:focus{outline:2px solid var(--accent);}
  .hint{font-size:.75rem;color:var(--muted);margin-top:10px;line-height:1.6;}
  button.calc{
    margin-top:20px;
    width:100%;
    padding:13px;
    border:none;
    border-radius:10px;
    background:linear-gradient(90deg,var(--accent),var(--accent2));
    color:#0f172a;
    font-weight:bold;
    font-size:1rem;
    cursor:pointer;
    transition:.15s;
  }
  button.calc:hover{filter:brightness(1.08);}
  button.calc:active{transform:scale(.98);}
  .error{
    color:var(--danger);
    background:rgba(248,113,113,.1);
    border:1px solid rgba(248,113,113,.4);
    padding:10px 14px;
    border-radius:8px;
    margin-top:14px;
    font-size:.9rem;
  }
  .result-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:14px 16px;
    border:1px solid var(--border);
    border-radius:10px;
    margin-bottom:10px;
    background:#0f172a;
  }
  .result-row .lbl{color:var(--muted);font-size:.85rem;}
  .result-row .val{font-weight:bold;font-size:1.05rem;}
  .weekday-badge{
    text-align:center;
    padding:14px;
    border-radius:10px;
    background:linear-gradient(90deg,rgba(56,189,248,.15),rgba(167,139,250,.15));
    border:1px solid var(--accent);
    font-size:1.2rem;
    font-weight:bold;
    margin-bottom:14px;
  }
  .note{font-size:.75rem;color:var(--muted);margin-top:8px;text-align:center;}
/* ===================== صفحة مقارنة التاريخين ===================== */
.date-pair{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
}
.date-box{
  padding:16px;
  border:1px solid var(--border);
  border-radius:12px;
  background:rgba(15,23,42,.45);
}
.date-box h2{
  font-size:1rem;
  margin:0 0 14px;
  text-align:center;
}
.date-box .fields{margin-top:0;}
.comparison{
  margin-top:20px;
}
.comparison-banner{
  padding:16px;
  border-radius:12px;
  text-align:center;
  background:linear-gradient(90deg,rgba(56,189,248,.15),rgba(167,139,250,.15));
  border:1px solid var(--accent);
  font-weight:bold;
  font-size:1.05rem;
  margin-bottom:14px;
}
.comparison-banner.same{border-color:var(--border);}
.diff-title{
  text-align:center;
  font-size:1rem;
  margin:8px 0 12px;
}
.diff-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}
.diff-item{
  border:1px solid var(--border);
  border-radius:10px;
  padding:14px 16px;
  background:#0f172a;
}
.diff-item .lbl{display:block;color:var(--muted);font-size:.8rem;margin-bottom:6px;}
.diff-item .val{font-weight:bold;font-size:1rem;}
.swap-note{
  color:var(--muted);
  font-size:.75rem;
  text-align:center;
  margin-top:10px;
}
/*  liks ---------------- */
a{
  color: var(--accent);
  text-decoration: none;
}
a:hover{
  color: #ffffff;
  text-decoration: underline;
}
.router-link-exact-active{
  color: #ffffff;
}

/*  pwa -------------- */
#pwaInstallBtn{
    padding: 10px 20px;
    background-color: #007bff;
    background-color: var(--accent2);
    color: white;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width:100%;
    font-weight: bold;
}


@media (max-width:700px){
  .date-pair,.diff-grid{grid-template-columns:1fr;}
}

</style>
