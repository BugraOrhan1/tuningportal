// Homepage configurator + file service logic
document.addEventListener('DOMContentLoaded', () => {
  // Pricing tabs
  document.querySelectorAll('.pricing-tabs button').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.pricing-tabs button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pricing-master').style.display = btn.dataset.tab==='master'?'grid':'none';
      document.getElementById('pricing-slave').style.display = btn.dataset.tab==='slave'?'grid':'none';
      document.getElementById('pricing-evc').style.display = btn.dataset.tab==='evc'?'grid':'none';
    });
  });
  // FAQ
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item=q.parentElement;
      item.classList.toggle('open');
    });
  });

  // Homepage HP configurator
  const hpMake=document.getElementById('hp-make');
  const hpModel=document.getElementById('hp-model');
  const hpGen=document.getElementById('hp-generation');
  const hpEngine=document.getElementById('hp-engine');
  const hpSearch=document.getElementById('hp-search');
  const hpResult=document.getElementById('hp-result');
  const hpError=document.getElementById('hp-error');
  if(hpMake && hpModel){
    hpMake.addEventListener('change', async ()=>{
      hpModel.innerHTML='<option value="">Choose a model</option>';
      hpGen.innerHTML='<option value="">Choose a generation</option>';
      hpEngine.innerHTML='<option value="">Choose an engine</option>';
      hpGen.disabled=true; hpEngine.disabled=true; hpResult.classList.remove('show'); hpError.style.display='none';
      if(!hpMake.value || hpMake.value==='other'){ hpModel.disabled=true; if(hpMake.value==='other'){ hpError.textContent='Please select “Otherwise, namely” and contact us for custom file.'; hpError.style.display='block'; } return; }
      hpModel.disabled=false; hpModel.innerHTML='<option value="">Loading...</option>';
      try{
        const res=await fetch(`/api/models?makeId=${hpMake.value}`);
        const models=await res.json();
        hpModel.innerHTML='<option value="">Choose a model</option>';
        models.forEach(m=>{ const o=document.createElement('option'); o.value=m.id; o.textContent=m.name; hpModel.appendChild(o); });
        hpModel.innerHTML+='<option value="other">Otherwise, namely</option>';
        if(models.length===0){ hpModel.innerHTML='<option value="">No models found</option><option value="other">Otherwise, namely</option>'; }
      }catch{ hpModel.innerHTML='<option value="">Error loading</option>';}
    });
    hpModel.addEventListener('change', async ()=>{
      hpGen.innerHTML='<option value="">Choose a generation</option>';
      hpEngine.innerHTML='<option value="">Choose an engine</option>';
      hpEngine.disabled=true; hpResult.classList.remove('show'); hpError.style.display='none';
      if(!hpModel.value || hpModel.value==='other'){ hpGen.disabled=true; return; }
      hpGen.disabled=false; hpGen.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/generations?modelId=${hpModel.value}`);
      const gens=await res.json();
      hpGen.innerHTML='<option value="">Choose a generation</option>';
      gens.forEach(g=>{ const o=document.createElement('option'); o.value=g.id; o.textContent=g.name; hpGen.appendChild(o); });
      hpGen.innerHTML+='<option value="other">Otherwise, namely</option>';
      if(gens.length===0) hpGen.innerHTML='<option value="">No generations</option><option value="other">Otherwise, namely</option>';
    });
    hpGen.addEventListener('change', async ()=>{
      hpEngine.innerHTML='<option value="">Choose an engine</option>';
      hpResult.classList.remove('show'); hpError.style.display='none';
      if(!hpGen.value || hpGen.value==='other'){ hpEngine.disabled=true; return; }
      hpEngine.disabled=false; hpEngine.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/engines?generationId=${hpGen.value}`);
      const engines=await res.json();
      hpEngine.innerHTML='<option value="">Choose an engine</option>';
      engines.forEach(e=>{ const o=document.createElement('option'); o.value=e.id; o.textContent=e.name; hpEngine.appendChild(o); });
      hpEngine.innerHTML+='<option value="other">Otherwise, namely</option>';
      if(engines.length===0) hpEngine.innerHTML='<option value="">No engines</option><option value="other">Otherwise, namely</option>';
    });
    hpEngine.addEventListener('change',()=>{ hpResult.classList.remove('show'); hpError.style.display='none'; });
    if(hpSearch){
      hpSearch.addEventListener('click', async (e)=>{
        e.preventDefault();
        hpError.style.display='none'; hpResult.classList.remove('show');
        if(!hpEngine.value){ hpError.textContent='Selecteer eerst een voertuig (make → model → generation → engine).'; hpError.style.display='block'; return; }
        if(hpEngine.value==='other'){ hpError.textContent='Tuning file is not available. We\'re working on this in our R&D department.'; hpError.style.display='block'; return; }
        hpSearch.textContent='Loading...'; hpSearch.disabled=true;
        try{
          const res=await fetch(`/api/power/${hpEngine.value}`);
          if(!res.ok) throw new Error();
          const data=await res.json();
          const engText=hpEngine.options[hpEngine.selectedIndex].text;
          document.getElementById('hp-engine-name').textContent=engText;
          document.getElementById('orig-hp').textContent=data.original.hp+' hp';
          document.getElementById('orig-kw').textContent=data.original.kw+' kW';
          document.getElementById('orig-nm').textContent=data.original.nm+' Nm';
          document.getElementById('tuned-hp').textContent=data.tuned.hp+' hp';
          document.getElementById('tuned-kw').textContent=data.tuned.kw+' kW';
          document.getElementById('tuned-nm').textContent=data.tuned.nm+' Nm';
          document.getElementById('gain-hp').textContent='+'+data.gainHp+' hp';
          document.getElementById('gain-nm').textContent='+'+data.gainNm+' Nm';
          // ecu name
          try{ const ecuRes=await fetch(`/api/ecus?engineId=${hpEngine.value}`); const ecus=await ecuRes.json(); if(ecus[0]) document.getElementById('ecu-name').textContent=ecus[0].name; }catch{}
          hpResult.classList.add('show');
          hpResult.scrollIntoView({behavior:'smooth', block:'nearest'});
        }catch{
          hpError.textContent='Tuning file is not available. We\'re working on this in our R&D department.';
          hpError.style.display='block';
        }finally{ hpSearch.innerHTML='<i class="fa fa-search"></i> Search'; hpSearch.disabled=false; }
      });
    }
  }

  // File-service form dynamics
  const makeSel=document.getElementById('vehicle_make_id');
  const modelSel=document.getElementById('vehicle_model_id');
  const genSel=document.getElementById('vehicle_generation_id');
  const engineSel=document.getElementById('vehicle_engine_id');
  const ecuSel=document.getElementById('vehicle_ecu_id');
  const hpInput=document.getElementById('vehicle_power_hp');
  const kwInput=document.getElementById('vehicle_power_kw');
  const viewPower=document.getElementById('view_power_increase');
  if(makeSel){
    // Helper to show/hide otherwise
    function toggleOther(sel, wrapId){ const wrap=document.getElementById(wrapId); if(!wrap) return; if(sel.value==='other') wrap.classList.remove('hide'); else wrap.classList.add('hide'); }
    makeSel.addEventListener('change', async ()=>{
      toggleOther(makeSel,'wrap_make_other');
      document.getElementById('wrap_vehicle_type').classList.toggle('hide', makeSel.value!=='other');
      modelSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      genSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      engineSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      ecuSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      genSel.disabled=true; engineSel.disabled=true; ecuSel.disabled=true;
      if(!makeSel.value || makeSel.value==='other'){ modelSel.disabled = !makeSel.value ? true : false; if(makeSel.value==='other') modelSel.disabled=false; return; }
      modelSel.disabled=false; modelSel.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/models?makeId=${makeSel.value}`);
      const data=await res.json();
      modelSel.innerHTML='<option value="">Make your choice</option>';
      data.forEach(m=>{ const o=document.createElement('option'); o.value=m.id; o.dataset.name=m.name; o.textContent=m.name; modelSel.appendChild(o); });
      modelSel.innerHTML+='<option value="other">Otherwise, namely</option>';
    });
    modelSel.addEventListener('change', async ()=>{
      toggleOther(modelSel,'wrap_model_other');
      genSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      engineSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      ecuSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      engineSel.disabled=true; ecuSel.disabled=true;
      if(!modelSel.value || modelSel.value==='other'){ genSel.disabled = modelSel.value==='other'?false:true; if(modelSel.value==='other') genSel.disabled=false; else genSel.disabled=true; return; }
      genSel.disabled=false; genSel.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/generations?modelId=${modelSel.value}`);
      const data=await res.json();
      genSel.innerHTML='<option value="">Make your choice</option>';
      data.forEach(g=>{ const o=document.createElement('option'); o.value=g.id; o.dataset.name=g.name; o.textContent=g.name; genSel.appendChild(o); });
      genSel.innerHTML+='<option value="other">Otherwise, namely</option>';
    });
    genSel.addEventListener('change', async ()=>{
      toggleOther(genSel,'wrap_generation_other');
      engineSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      ecuSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      ecuSel.disabled=true;
      if(!genSel.value || genSel.value==='other'){ engineSel.disabled = genSel.value==='other'?false:true; if(genSel.value==='other') engineSel.disabled=false; else engineSel.disabled=true; return; }
      engineSel.disabled=false; engineSel.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/engines?generationId=${genSel.value}`);
      const data=await res.json();
      engineSel.innerHTML='<option value="">Make your choice</option>';
      data.forEach(e=>{ const o=document.createElement('option'); o.value=e.id; o.dataset.name=e.name; o.textContent=e.name; engineSel.appendChild(o); });
      engineSel.innerHTML+='<option value="other">Otherwise, namely</option>';
    });
    engineSel.addEventListener('change', async ()=>{
      toggleOther(engineSel,'wrap_engine_other');
      ecuSel.innerHTML='<option value="">Make your choice</option><option value="other">Otherwise, namely</option>';
      if(!engineSel.value || engineSel.value==='other'){
        ecuSel.disabled = engineSel.value==='other'?false:true;
        viewPower.style.display='none';
        if(engineSel.value==='other') ecuSel.disabled=false; else ecuSel.disabled=true;
        return;
      }
      // Fetch ECU
      ecuSel.disabled=false; ecuSel.innerHTML='<option value="">Loading...</option>';
      const res=await fetch(`/api/ecus?engineId=${engineSel.value}`);
      const data=await res.json();
      ecuSel.innerHTML='<option value="">Make your choice</option>';
      data.forEach(ec=>{ const o=document.createElement('option'); o.value=ec.id; o.dataset.name=ec.name; o.textContent=ec.name; ecuSel.appendChild(o); });
      ecuSel.innerHTML+='<option value="other">Otherwise, namely</option>';
      // Power + auto fill HP/KW
      try{
        const pRes=await fetch(`/api/power/${engineSel.value}`);
        const p=await pRes.json();
        if(hpInput) hpInput.value=p.original.hp;
        if(kwInput) kwInput.value=p.original.kw;
        viewPower.style.display='inline';
        viewPower.onclick=(e)=>{ e.preventDefault(); alert(`Power increase voor ${engineSel.options[engineSel.selectedIndex].text}:\nOrigineel: ${p.original.hp} hp / ${p.original.kw} kW / ${p.original.nm} Nm\nTuned: ${p.tuned.hp} hp / ${p.tuned.kw} kW / ${p.tuned.nm} Nm\nWinst: +${p.gainHp} hp / +${p.gainNm} Nm`); };
      }catch{}
    });
    ecuSel.addEventListener('change', ()=>{ toggleOther(ecuSel,'wrap_ecu_other'); });

    // HP <-> KW conversion (1 kW = 1.35962 hp)
    if(hpInput && kwInput){
      let lock=false;
      hpInput.addEventListener('input',()=>{
        if(lock) return;
        lock=true;
        if(hpInput.value) kwInput.value = Math.round(hpInput.value/1.35962);
        lock=false;
      });
      kwInput.addEventListener('input',()=>{
        if(lock) return;
        lock=true;
        if(kwInput.value) hpInput.value = Math.round(kwInput.value*1.35962);
        lock=false;
      });
    }

    // Read method other
    const readSel=document.getElementById('read_method_id');
    if(readSel){
      readSel.addEventListener('change',()=>{
        const wrap=document.getElementById('wrap_read_other'); const spacer=document.getElementById('spacer_read');
        if(readSel.value==='Otherwise, namely'){ wrap.classList.remove('hide'); spacer.classList.remove('hide'); } else { wrap.classList.add('hide'); spacer.classList.add('hide'); }
      });
    }

    // Tuning type options
    const tuningRadios=document.querySelectorAll('input[name="tuning_type_id"]');
    const optionsContainer=document.getElementById('tuningOptionsContainer');
    const optionsGrid=document.getElementById('tuningOptionsGrid');
    if(tuningRadios.length){
      tuningRadios.forEach(r=>{
        r.addEventListener('change',()=>{
          const typeId=r.value;
          const opts=tuningData.optionsByType[typeId] || [];
          if(opts.length===0){ optionsContainer.style.display='none'; optionsGrid.innerHTML=''; return; }
          optionsContainer.style.display='block';
          optionsGrid.innerHTML = opts.map(o=>`
            <label class="FancyCheckbox" style="border:1px solid var(--border);padding:10px;background:#fff;position:relative">
              <input type="checkbox" value="${o.id}" data-credits="${o.credits}" data-name="${o.name}" class="opt-check">
              <span></span>
              <span>${o.name} (+${o.credits.toFixed(2)} credit${o.credits!==1?'s':''})</span>
              ${o.hasRPM ? `<input type="text" placeholder="Specify desired RPM value (3500 RPM and up recommended)" class="form-control" style="margin-top:6px;display:none" data-rpm="${o.id}">` : ''}
              ${o.hasLoudness ? `<select class="form-control" style="margin-top:6px;display:none" data-loud="${o.id}"><option value="">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>` : ''}
              ${o.hasDTC ? `<div style="display:none;margin-top:6px" data-dtc="${o.id}"><input type="text" placeholder="Specify desired DTC's to be turned off" class="form-control dtc-input" data-dtc-input="${o.id}"><div style="font-size:10px;color:#78909c;margin-top:4px">The meaning of a DTC can differ per brand so look carefully at the description</div></div>` : ''}
            </label>
          `).join('');
          // Attach toggle for extra fields
          optionsGrid.querySelectorAll('.opt-check').forEach(cb=>{
            cb.addEventListener('change',()=>{
              const id=cb.value;
              const rpm=document.querySelector(`[data-rpm="${id}"]`);
              const loud=document.querySelector(`[data-loud="${id}"]`);
              const dtc=document.querySelector(`[data-dtc="${id}"]`);
              if(rpm) rpm.style.display = cb.checked ? 'block' : 'none';
              if(loud) loud.style.display = cb.checked ? 'block' : 'none';
              if(dtc) dtc.style.display = cb.checked ? 'block' : 'none';
            });
          });
        });
      });
    }

    // Modified parts
    const hasMod=document.getElementById('has_modified_parts');
    if(hasMod){
      hasMod.addEventListener('change',()=>{
        const notice=document.getElementById('wrap_modified_notice');
        const parts=document.getElementById('wrap_modified_parts');
        const remarks=document.getElementById('wrap_modified_parts_remarks');
        if(hasMod.value==='1'){ notice.classList.remove('hide'); parts.classList.remove('hide'); remarks.classList.remove('hide'); }
        else { notice.classList.add('hide'); parts.classList.add('hide'); remarks.classList.add('hide'); }
      });
      const modCheck=document.querySelector('input[name="modified_installed"]');
      if(modCheck){
        modCheck.addEventListener('change',()=>{
          document.getElementById('wrap_modified_remarks').classList.toggle('hide', !modCheck.checked);
          // Actually this is duplicate id, use remarks inside modified parts
          const inner=document.getElementById('wrap_modified_remarks');
          // The inner remarks is for modified installed checkbox
          const instRemarks=document.querySelector('#wrap_modified_parts #wrap_modified_remarks');
          if(instRemarks) instRemarks.classList.toggle('hide', !modCheck.checked);
        });
      }
    }

    // File upload handlers
    function setupDrop(dropId, inputId, nameId){
      const drop=document.getElementById(dropId);
      const input=document.getElementById(inputId);
      const nameEl=document.getElementById(nameId);
      if(!drop || !input) return;
      drop.addEventListener('click',()=>input.click());
      drop.addEventListener('dragover',e=>{ e.preventDefault(); drop.style.borderColor='var(--primary)'; });
      drop.addEventListener('dragleave',()=>drop.style.borderColor='var(--border)');
      drop.addEventListener('drop',e=>{
        e.preventDefault(); drop.style.borderColor='var(--border)';
        if(e.dataTransfer.files.length){ input.files=e.dataTransfer.files; updateName(); }
      });
      input.addEventListener('change',updateName);
      function updateName(){
        if(input.files[0] && nameEl) nameEl.textContent=input.files[0].name+' ('+(input.files[0].size/1024/1024).toFixed(2)+' MB)';
      }
    }
    setupDrop('dropOriginal','originalFile','originalFileName');
    setupDrop('dropTcu','tcuFile','tcuFileName');
    const dropAtt=document.getElementById('dropAttachments');
    const attInput=document.getElementById('attachments');
    const attList=document.getElementById('attachmentsList');
    if(dropAtt && attInput){
      dropAtt.addEventListener('click',()=>attInput.click());
      dropAtt.addEventListener('dragover',e=>{e.preventDefault(); dropAtt.style.borderColor='var(--primary)';});
      dropAtt.addEventListener('dragleave',()=>dropAtt.style.borderColor='var(--border)');
      dropAtt.addEventListener('drop',e=>{e.preventDefault(); attInput.files=e.dataTransfer.files; renderAtt();});
      attInput.addEventListener('change',renderAtt);
      function renderAtt(){
        if(!attInput.files.length){ attList.style.display='none'; attList.innerHTML=''; return; }
        attList.style.display='block';
        attList.innerHTML=Array.from(attInput.files).map(f=>`<div style="padding:6px 8px;border:1px solid var(--border);background:#fff;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;font-size:12px"><span><i class="fa fa-paperclip"></i> ${f.name} (${(f.size/1024).toFixed(1)} KB)</span><span style="color:#78909c">${f.type||'file'}</span></div>`).join('');
      }
    }

    // Form submit
    const form=document.getElementById('file-service');
    if(form){
      form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const btn=document.getElementById('submitBtn'); const err=document.getElementById('submitError');
        err.style.display='none';
        btn.disabled=true; btn.textContent='Submitting...';
        try{
          const fd=new FormData(form);
          // Collect extra data for API
          const makeName = makeSel.options[makeSel.selectedIndex]?.dataset?.name || makeSel.options[makeSel.selectedIndex]?.text || '';
          const modelName = modelSel.options[modelSel.selectedIndex]?.dataset?.name || modelSel.options[modelSel.selectedIndex]?.text || '';
          const genName = genSel.options[genSel.selectedIndex]?.dataset?.name || genSel.options[genSel.selectedIndex]?.text || '';
          const engineName = engineSel.options[engineSel.selectedIndex]?.dataset?.name || engineSel.options[engineSel.selectedIndex]?.text || '';
          const ecuName = ecuSel.options[ecuSel.selectedIndex]?.dataset?.name || ecuSel.options[ecuSel.selectedIndex]?.text || '';
          const gearboxSel=form.querySelector('select[name="gearbox_id"]');
          const gearboxName=gearboxSel.options[gearboxSel.selectedIndex]?.dataset?.name || gearboxSel.options[gearboxSel.selectedIndex]?.text || '';
          // Tuning options
          const checkedOpts=Array.from(document.querySelectorAll('.opt-check:checked')).map(cb=>cb.value);
          const optionDetails={};
          document.querySelectorAll('.opt-check:checked').forEach(cb=>{
            const id=cb.value;
            const rpm=document.querySelector(`[data-rpm="${id}"]`);
            const loud=document.querySelector(`[data-loud="${id}"]`);
            const dtc=document.querySelector(`[data-dtc-input="${id}"]`);
            optionDetails[id]={ rpm: rpm?rpm.value:'', loudness: loud?loud.value:'', dtc: dtc?dtc.value:'' };
          });
          // Build final FormData for API
          const apiFd=new FormData();
          apiFd.append('make_id', makeSel.value);
          apiFd.append('make', form.querySelector('input[name="make"]').value);
          apiFd.append('makeName', makeName);
          apiFd.append('model_id', modelSel.value);
          apiFd.append('modelName', modelName);
          apiFd.append('generation_id', genSel.value);
          apiFd.append('generationName', genName);
          apiFd.append('engine_id', engineSel.value);
          apiFd.append('engineName', engineName);
          apiFd.append('ecu_id', ecuSel.value);
          apiFd.append('ecuName', ecuName);
          apiFd.append('power_hp', form.querySelector('input[name="power_hp"]').value);
          apiFd.append('power_kw', form.querySelector('input[name="power_kw"]').value);
          apiFd.append('year', form.querySelector('select[name="year"]').value);
          apiFd.append('gearbox_id', gearboxSel.value);
          apiFd.append('gearbox', gearboxName);
          apiFd.append('license_plate', form.querySelector('input[name="license_plate"]').value);
          apiFd.append('vin', form.querySelector('input[name="vin"]').value);
          apiFd.append('octane_rating', form.querySelector('select[name="octane_rating"]').value);
          apiFd.append('tool_type', form.querySelector('select[name="tool_type"]').value);
          apiFd.append('read_method_id', form.querySelector('select[name="read_method_id"]').value);
          apiFd.append('read_method_other', form.querySelector('input[name="read_method_other"]').value);
          apiFd.append('hardware_number', form.querySelector('input[name="hardware_number"]').value);
          apiFd.append('software_number', form.querySelector('input[name="software_number"]').value);
          apiFd.append('tuning_type_id', form.querySelector('input[name="tuning_type_id"]:checked')?.value || '');
          apiFd.append('options', JSON.stringify(checkedOpts));
          apiFd.append('optionDetails', JSON.stringify(optionDetails));
          apiFd.append('has_modified_parts', form.querySelector('select[name="has_modified_parts"]').value);
          apiFd.append('modified_parts_remarks', form.querySelector('textarea[name="modified_parts_remarks"]').value);
          apiFd.append('modified_details', form.querySelector('textarea[name="modified_remarks"]')?.value || '');
          apiFd.append('time_frame', form.querySelector('select[name="time_frame"]').value);
          apiFd.append('info', form.querySelector('textarea[name="info"]').value);
          apiFd.append('terms_and_conditions', form.querySelector('input[name="terms_and_conditions"]').checked ? '1' : '0');
          apiFd.append('refund_policy', form.querySelector('input[name="refund_policy"]').checked ? '1' : '0');
          const origFile=document.getElementById('originalFile').files[0];
          if(origFile) apiFd.append('originalFile', origFile);
          const tcuFile=document.getElementById('tcuFile').files[0];
          if(tcuFile) apiFd.append('tcuFile', tcuFile);
          const atts=document.getElementById('attachments').files;
          for(let i=0;i<atts.length;i++) apiFd.append('attachments', atts[i]);

          const token = localStorage.getItem('token');
          const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
          const res=await fetch('/api/file-services', {method:'POST', body:apiFd, headers, credentials:'include'});
          const data=await res.json();
          if(!res.ok) throw new Error(data.error || 'Er ging iets mis');
          alert('File service succesvol ingediend! Credits gebruikt: '+data.credits.toFixed(2));
          window.location='/account/file-services';
        }catch(ex){
          err.textContent=ex.message; err.style.display='block';
        }finally{ btn.disabled=false; btn.textContent='Submit file service'; }
      });
    }
  }
});
