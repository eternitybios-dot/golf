import { test, expect } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';

test('practice resumes, pauses accurately, saves and edits a record',async({page})=>{
  await page.clock.install({time:new Date()});
  await page.goto('');
  await page.getByRole('link',{name:'この練習をやってみる'}).click();
  await page.getByRole('button',{name:'このメニューを始める'}).click();
  await page.getByRole('button',{name:'次の手順'}).click();
  await page.getByRole('button',{name:'+10',exact:true}).click();
  await expect(page.getByRole('status',{name:'実施回数'})).toHaveText('10');
  await page.reload();
  await expect(page.getByRole('status',{name:'実施回数'})).toHaveText('10');
  await page.clock.fastForward(65000);
  await expect(page.getByLabel('練習経過時間')).toContainText('01:');
  await page.getByRole('button',{name:'休憩する',exact:true}).click();
  const paused=await page.getByLabel('練習経過時間').textContent();
  await page.clock.fastForward(60000);
  await expect(page.getByLabel('練習経過時間')).toHaveText(paused!);
  await page.getByRole('button',{name:'途中で終えて記録する'}).click();
  await page.getByLabel('構えをゆっくり確認の成功数').fill('7');
  await page.getByPlaceholder('例：ゆっくり構えたら、少し安定した。').fill('構えをゆっくり確認できた。');
  await expect(page.locator('.connection')).not.toContainText('保存中');
  await page.reload();
  await expect(page.getByLabel('構えをゆっくり確認の成功数')).toHaveValue('7');
  await expect(page.getByPlaceholder('例：ゆっくり構えたら、少し安定した。')).toHaveValue('構えをゆっくり確認できた。');
  await page.getByRole('button',{name:'今日の練習を保存する'}).click();
  await expect(page).toHaveURL(/#\/records\//);
  await expect(page.getByText('構えをゆっくり確認できた。',{exact:true})).toBeVisible();
  await page.reload();
  await expect(page.getByText('構えをゆっくり確認できた。',{exact:true})).toBeVisible();
  await page.getByRole('button',{name:'記録を編集'}).click();
  await page.getByLabel('構えをゆっくり確認の成功数').fill('8');
  await page.getByRole('button',{name:'変更を保存する'}).click();
  await expect(page.locator('.record-numbers').first()).toContainText('8');
});

test('JSON restores records in a fresh storage area and rejects invalid data',async({page,browser})=>{
  await page.goto('');
  await page.getByRole('link',{name:'この練習をやってみる'}).click();
  await page.getByRole('button',{name:'このメニューを始める'}).click();
  await page.getByRole('button',{name:'次の手順'}).click();
  await page.getByRole('button',{name:'+10',exact:true}).click();
  await page.getByRole('button',{name:'途中で終えて記録する'}).click();
  await page.getByRole('button',{name:'今日の練習を保存する'}).click();
  await page.getByRole('link',{name:'設定',exact:true}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'JSONを書き出す'}).click();
  const download=await downloadPromise;
  const bytes=await readFile((await download.path())!);
  const backup=JSON.parse(bytes.toString());
  expect(backup.records).toHaveLength(1);expect(backup.records[0].results[0].success).toBeNull();
  const context=await browser.newContext();const restored=await context.newPage();
  await restored.goto('http://127.0.0.1:4173/golf/#/settings');
  await restored.getByLabel('バックアップJSON').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:bytes});
  await restored.getByRole('button',{name:'追加して取り込む'}).click();
  await expect(restored.getByText('記録を取り込みました。')).toBeVisible();
  await restored.getByLabel('バックアップJSON').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:bytes});
  await restored.getByRole('button',{name:'追加して取り込む'}).click();
  backup.records[0].results[0].success=999;
  await restored.getByLabel('バックアップJSON').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
  await expect(restored.getByRole('alert')).toContainText('不正なデータ');
  await restored.goto('http://127.0.0.1:4173/golf/#/records');
  await expect(restored.locator('.record-row')).toHaveCount(1);
  await context.close();
});

test('all lessons, illustration expansion and left-handed switching work',async({page})=>{
  await page.goto('#/learn');
  await expect(page.locator('.lesson-card')).toHaveCount(8);
  await page.locator('.lesson-card').first().click();
  await page.getByRole('button',{name:'左打ち',exact:true}).click();
  await expect(page.locator('.figure-image').first().locator('svg > g').last()).toHaveAttribute('transform','translate(360 0) scale(-1 1)');
  await page.getByRole('button',{name:'指に沿わせて握るの図を拡大'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button',{name:'閉じる',exact:true}).click();
  await page.getByRole('button',{name:'このレッスンを読了にする'}).click();
  await expect(page.getByRole('button',{name:'読了メモを更新'})).toBeVisible();
  await page.goto('#/lesson/L05');
  for(let i=1;i<6;i++)await page.getByRole('button',{name:'次の場面'}).click();
  await expect(page.locator('.frame-controls')).toContainText('6 / 6');
});

test('offline launch opens uncached routes and saves practice records',async({page,context})=>{
  await page.goto('');
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await context.setOffline(true);
  await page.goto('http://127.0.0.1:4173/golf/#/lesson/L07');
  await expect(page.getByRole('heading',{name:'アプローチのコツ',exact:true})).toBeVisible();
  await expect(page.locator('.figure-image svg.illustration')).toHaveCount(3);
  await page.goto('http://127.0.0.1:4173/golf/#/menu/home-5');
  await page.getByRole('button',{name:'このメニューを始める'}).click();
  await page.getByRole('button',{name:'途中で終えて記録する'}).click();
  await page.getByRole('button',{name:'今日の練習を保存する'}).click();
  await expect(page).toHaveURL(/#\/records\//);
  await page.reload();
  await expect(page.getByRole('heading',{name:'5分で、構えを整える',exact:true})).toBeVisible();
});

test('mobile layouts do not overflow and screen previews are captured',async({page})=>{
  await mkdir('artifacts',{recursive:true});
  for(const width of [320,390,430,1440]){
    await page.setViewportSize({width,height:width===1440?1050:844});
    for(const path of ['','#/learn','#/lesson/L01','#/lesson/L05','#/practice','#/settings','#/records']){
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${width}px ${path}`).toBe(true);
    }
    if(width===390||width===1440){await page.goto('');await page.screenshot({path:`artifacts/home-${width}.png`,fullPage:true});}
  }
});

test('a failed write retains the result form and can be retried',async({page})=>{
  await page.goto('#/menu/home-5');
  await page.getByRole('button',{name:'このメニューを始める'}).click();
  await page.getByRole('button',{name:'途中で終えて記録する'}).click();
  await expect(page.locator('.connection')).not.toContainText('保存中');
  await page.evaluate(()=>{
    const original=IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put=function(...args:Parameters<typeof original>){throw new DOMException('Quota exceeded','QuotaExceededError');};
    (window as unknown as {restorePut:()=>void}).restorePut=()=>{IDBObjectStore.prototype.put=original;};
  });
  await page.getByPlaceholder('例：ゆっくり構えたら、少し安定した。').fill('保存を再試行するメモ');
  await page.getByRole('button',{name:'今日の練習を保存する'}).click();
  await expect(page.locator('.save-error')).toContainText('保存できませんでした');
  await expect(page).toHaveURL(/#\/finish/);
  await expect(page.getByPlaceholder('例：ゆっくり構えたら、少し安定した。')).toHaveValue('保存を再試行するメモ');
  await page.evaluate(()=>{(window as unknown as {restorePut:()=>void}).restorePut();});
  await page.getByRole('button',{name:'今日の練習を保存する'}).click();
  await expect(page).toHaveURL(/#\/records\//);
  await page.reload();
  await expect(page.getByText('保存を再試行するメモ',{exact:true})).toBeVisible();
});
