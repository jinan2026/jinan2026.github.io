'use strict';
(() => {
  const cfg = window.JINAN_CONFIG || {};
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const put = (selector, value) => { if (typeof value === 'string' && value.trim()) $$(selector).forEach(el => el.textContent = value); };
  put('[data-company]', cfg.companyName); put('[data-city]', cfg.city); put('[data-stage]', cfg.launchStage);
  put('#year', String(new Date().getFullYear()));
  if (cfg.launchStage && !cfg.launchStage.includes('筹建')) $$('.footer-stage').forEach(el => el.hidden = true);
  const safeHttps = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
  if (cfg.domain && safeHttps(cfg.domain)) {
    const canonical = document.querySelector('link[rel=canonical]') || document.createElement('link'); canonical.rel = 'canonical';
    const file = location.pathname.endsWith('privacy.html') ? 'privacy.html' : '';
    canonical.href = new URL(file, cfg.domain.replace(/\/?$/, '/')).href; document.head.append(canonical);
  }
  const contacts = cfg.contact || {};
  const emailValid = typeof contacts.email === 'string' && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contacts.email);
  const phoneValid = typeof contacts.phone === 'string' && /^[+\d\s()-]{5,25}$/.test(contacts.phone);
  const contactArea = $('#contact-lines');
  if (contactArea) {
    const row = (label, value, href) => { const el = document.createElement('span'), key = document.createElement('b'), val = document.createElement(href ? 'a' : 'span'); key.textContent = label; val.textContent = value; if (href) val.href = href; el.append(key,val); contactArea.append(el); };
    if (emailValid) row('商务邮箱', contacts.email, 'mailto:' + contacts.email);
    if (phoneValid) row('联系电话', contacts.phone, 'tel:' + contacts.phone.replace(/[\s()-]/g,''));
    if (contacts.wechat) row('商务微信', String(contacts.wechat));
    if (contacts.qrImage && /^(?:assets\/)?[a-zA-Z0-9_./-]+\.(png|jpg|jpeg|webp|svg)$/.test(contacts.qrImage) && !contacts.qrImage.includes('..')) { $$('.wecom-card-image').forEach(img => img.src = contacts.qrImage); $$('.original-card-link').forEach(a => a.href = contacts.qrImage); }
    if (emailValid || phoneValid || contacts.wechat) { $('.contact-pending')?.remove(); put('.contact-caption', '欢迎沟通任务场景、设备条件与试点计划。你也可以先整理右侧需求清单，再发送给我们。'); }
  }
  const filing = $('#filing-links');
  const addFiling = (text, url) => { if (!filing || !text || !safeHttps(url)) return; const a=document.createElement('a');a.textContent=text;a.href=url;a.target='_blank';a.rel='noopener noreferrer';filing.append(a); };
  addFiling(cfg.icpNumber, 'https://beian.miit.gov.cn/'); addFiling(cfg.policeNumber, cfg.policeUrl);
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  const closeNav = () => { if (!menu || !nav) return; menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航'); nav.classList.remove('open'); };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label', open?'关闭导航':'打开导航');nav.classList.toggle('open',open); });
  nav?.addEventListener('click', e => { if(e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && nav?.classList.contains('open')) { closeNav();menu.focus(); } });
  document.addEventListener('click', e => { if (nav?.classList.contains('open') && !e.target.closest('.nav-wrap')) closeNav(); });
  const scenes = {
    kitchen: { code:'SCENE 01', type:'EVERYDAY MANIPULATION', title:'从杯碗取放开始理解动作。', description:'在清晰、稳定的桌面场景中，记录物品从起点到目标区域的完整操作过程。', focus:['物品与双手完整入镜','起止位置与动作连续性','任务区域整洁、无隐私物品'] },
    desk: { code:'SCENE 02', type:'SORTING & ORGANIZING', title:'让桌面的变化，有迹可循。', description:'通过书本、文具等物品的分类与摆放，记录有明确步骤的日常整理过程。', focus:['物品分类与摆放顺序','遮挡情况与操作完整性','移开个人文件与亮屏设备'] },
    storage: { code:'SCENE 03', type:'PICK, PLACE & STORE', title:'从取出到归位，记录完整过程。', description:'围绕收纳盒与日常物品，拆解取出、移动、摆放等动作，明确每一步任务边界。', focus:['收纳空间与任务区域','物品起止状态可辨识','家人知情与空间使用授权'] }
  };
  const tabs = $$('.scene-tab');
  const activate = (button, focus = false) => { const key = button.dataset.scene, scene = scenes[key]; if(!scene) return; tabs.forEach(t => { const selected=t===button;t.classList.toggle('active',selected);t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1; });$('#scene-panel').setAttribute('aria-labelledby',button.id);$('.scene-demo').dataset.demo=key;put('#demo-code',scene.code);put('#scene-type',scene.type);put('#scene-title',scene.title);put('#scene-description',scene.description);const list=$('#scene-focus');list.replaceChildren(...scene.focus.map(item=>{const li=document.createElement('li');li.textContent=item;return li;}));if(focus) button.focus(); };
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let index;if(['ArrowDown','ArrowRight'].includes(e.key)) index=(i+1)%tabs.length;else if(['ArrowUp','ArrowLeft'].includes(e.key)) index=(i-1+tabs.length)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;if(index!==undefined){e.preventDefault();activate(tabs[index],true);}});});
  const orientation=()=>$('.scene-tabs')?.setAttribute('aria-orientation',matchMedia('(max-width:760px)').matches?'horizontal':'vertical');orientation();window.addEventListener('resize',orientation,{passive:true});
  const dialog = $('#join-dialog');
  $$('[data-open-join]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
  $$('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog?.addEventListener('click', e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  const qrDialog = $('#qr-dialog');
  $$('[data-open-qr]').forEach(button => button.addEventListener('click', () => qrDialog.showModal()));
  $$('[data-close-qr]').forEach(button => button.addEventListener('click', () => qrDialog.close()));
  qrDialog?.addEventListener('click', e => { const r=qrDialog.getBoundingClientRect(); if(e.target===qrDialog && (e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)) qrDialog.close(); });
  const briefForm=$('#brief-form'), briefText=$('#brief-text'), emailLink=$('#email-brief');
  const refreshMail=()=>{if(!emailLink||!emailValid)return;emailLink.href='mailto:'+contacts.email+'?subject='+encodeURIComponent('项目合作需求｜'+(cfg.companyName||'锦安数科'))+'&body='+encodeURIComponent(briefText.value);emailLink.hidden=false;};
  briefForm?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(briefForm);const types=form.getAll('service');const details=String(form.get('details')||'').trim();briefText.value=[(cfg.companyName||'锦安数科')+'｜项目需求清单','', '合作方向：'+(types.length?types.join('、'):'待沟通'),'场景类型：'+form.get('scene'),'项目阶段：'+form.get('stage'),'任务与设备要求：'+(details||'待沟通'),'', '后续沟通建议：','1. 目标数量与期望周期','2. 设备型号、提供方式与使用授权','3. 数据格式、样例与验收规则','4. 采集授权、交付渠道与保存期限','5. 报价、结算与返工安排'].join('\n');$('#brief-output').hidden=false;put('#brief-status','已在当前页面生成，尚未发送给公司。');refreshMail();briefText.focus();});
  if (briefForm) $('.form-submit', briefForm).disabled = false;
  briefText?.addEventListener('input',refreshMail);
  $('#download-brief')?.addEventListener('click',()=>{const blob=new Blob(['\uFEFF'+briefText.value],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='锦安数科-项目需求清单.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);put('#brief-status','需求清单已生成下载文件，请自行发送给公司。');});
  $('#copy-brief')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(briefText.value);put('#brief-status','已复制，可粘贴到你的沟通工具中发送。');}catch{briefText.focus();briefText.select();put('#brief-status','已选中清单，请使用系统的复制命令。');}});
})();
