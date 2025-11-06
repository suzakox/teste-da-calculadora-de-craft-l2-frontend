import React, {useEffect, useState} from 'react'

const DEFAULT_API = import.meta.env.VITE_API_URL || '/api/recipes';

export default function App(){
  const [recipes, setRecipes] = useState([]);
  const [url, setUrl] = useState(DEFAULT_API);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes(endpoint=url){
    setLoading(true);
    setError('');
    try{
      const res = await fetch(endpoint);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setRecipes(data || []);
    }catch(e){
      setError(String(e));
      setRecipes([]);
    }finally{
      setLoading(false);
    }
  }

  async function handleUpload(ev){
    const f = ev.target.files[0];
    if(!f) return;
    const text = await f.text();
    try{
      const parsed = JSON.parse(text);
      setRecipes(parsed);
    }catch(e){
      alert('Falha ao ler JSON: ' + e.message);
    }
  }

  return (
    <div style={{fontFamily:'Arial, sans-serif',padding:20,maxWidth:980,margin:'0 auto'}}>
      <h1>L2HF Craft Calculator — Demo</h1>
      <p>Este frontend busca recipes em <code>{DEFAULT_API}</code>. Se não houver backend, faça upload do arquivo JSON exportado das tabelas L2J (recipes + recipe_ingredients já mesclados).</p>
      <div style={{marginBottom:12}}>
        <input placeholder="/api/recipes or URL" value={url} onChange={e=>setUrl(e.target.value)} style={{width:'60%'}}/>
        <button onClick={()=>fetchRecipes(url)} style={{marginLeft:8}}>Carregar</button>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{marginRight:8}}>Upload JSON (recipes merged):</label>
        <input type="file" accept=".json" onChange={handleUpload}/>
      </div>
      {loading && <div>Carregando...</div>}
      {error && <div style={{color:'red'}}>Erro: {error}</div>}
      <div>
        <strong>Total de recipes carregadas:</strong> {recipes.length}
      </div>
      <div style={{marginTop:16}}>
        {recipes.slice(0,200).map(r=>(
          <div key={r.id || r.recipe_id} style={{padding:8,borderBottom:'1px solid #ddd'}}>
            <div style={{fontWeight:600}}>{r.name || r.recipe_name} <small style={{color:'#666'}}>#{r.id || r.recipe_id}</small></div>
            <div style={{fontSize:13,color:'#444'}}>Ingredientes: { (r.ingredients && r.ingredients.length) || '—' }</div>
          </div>
        ))}
      </div>
    </div>
  )
}
