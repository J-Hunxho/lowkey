(async function(){
  const status = await fetch("https://<your-worker-subdomain>.workers.dev/api/v1/vault/status").then(r=>r.json()).catch(()=>null);

  const founderLeft = status?.founder ?? 100;
  const innerLeft = status?.inner ?? 30;

  const modal = document.createElement('div');
  modal.innerHTML = `
    <div class="lk-backdrop" style="position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div class="lk-modal" role="dialog" aria-modal="true" style="max-width:640px;width:92%;background:#0b0b0c;color:#f5f5f7;border:1px solid #2a2a2e;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5);overflow:hidden">
        <div style="font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;background:#121216;color:#bdbdbf;padding:.5rem 1rem;border-bottom:1px solid #2a2a2e">Lowkey • Private Admit</div>
        <div style="padding:1.25rem 1.25rem 1rem">
          <h2 style="margin:0 0 .5rem 0;font-size:1.6rem;line-height:1.2">The Vault opens softly.</h2>
          <p style="margin:0 0 1rem 0;color:#cfcfd2">150 keys only. Entry begins at $1,000. Proceed if you belong.</p>
          <div style="display:flex;gap:.75rem;flex-wrap:wrap;margin:.5rem 0 1rem">
            <div style="flex:1 1 130px;background:#121216;border:1px solid #24242a;border-radius:12px;padding:.75rem">
              <h4 style="margin:0 0 .25rem 0;font-size:.85rem;color:#9e9ea3;letter-spacing:.04em;text-transform:uppercase">Founder Keys</h4>
              <div style="font-variant-numeric:tabular-nums;font-size:1.25rem">${founderLeft} left</div>
            </div>
            <div style="flex:1 1 130px;background:#121216;border:1px solid #24242a;border-radius:12px;padding:.75rem">
              <h4 style="margin:0 0 .25rem 0;font-size:.85rem;color:#9e9ea3;letter-spacing:.04em;text-transform:uppercase">Inner Circle</h4>
              <div style="font-variant-numeric:tabular-nums;font-size:1.25rem">${innerLeft} left</div>
            </div>
          </div>
          <div style="display:flex;gap:.5rem">
            <button id="lkFounder" style="flex:1;appearance:none;border:none;border-radius:12px;padding:.9rem 1.1rem;font-weight:700;background:#f5f5f7;color:#0b0b0c;cursor:pointer">Request Founder Access — $1,000</button>
            <button id="lkInner" style="flex:1;appearance:none;border:1px solid #2a2a2e;border-radius:12px;padding:.9rem 1.1rem;font-weight:700;background:transparent;color:#bdbdbf;cursor:pointer">Inner Circle — $5,000</button>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0 1.25rem 1.1rem 1.25rem">
          <div style="font-size:.85rem;color:#a9a9ad">Secure checkout via Square • Keys are non-transferable at this stage</div>
          <button id="lkClose" style="background:transparent;border:none;color:#a9a9ad;font-size:.95rem;cursor:pointer">Close</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const post = async (endpoint) => {
    const r = await fetch(`https://<your-worker-subdomain>.workers.dev${endpoint}`, {method:"POST"});
    if(!r.ok) return alert("Sold out or unavailable.");
    const {url} = await r.json();
    location.href = url;
  };

  modal.querySelector("#lkFounder").onclick = ()=>post("/api/v1/vault/checkout/founder");
  modal.querySelector("#lkInner").onclick = ()=>post("/api/v1/vault/checkout/inner");
  modal.querySelector("#lkClose").onclick = ()=>modal.remove();
})();
