import {test,expect} from '@playwright/test';

test('the latest edit wins when native IPC replies arrive out of order',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('lang','en');
  // Synthetic IPC transport for race testing only; no native command is executed.
  Object.defineProperty(window,'__TAURI_INTERNALS__',{value:{
   invoke:async(command:string,args:{text?:string}={})=>{
    if(command==='lab_tokenize'||command==='lab_community_count'){
     const text=args.text??'';
     await new Promise(resolve=>setTimeout(resolve,text==='old delayed input'?250:10));
     const count=[...text].length;
     return command==='lab_tokenize'?{count,pieces:[{text,tokens:count}],ids:[]}:{count,messageCount:count+6,messageOverhead:6,family:'v4.8'};
    }
    return null;
   }
  }});
 });
 await page.goto('/labs/#tokens');
 const input=page.locator('#token-text-zh');
 await expect(page.getByTestId('count-o200k-zh')).toBeVisible();
 await input.fill('old delayed input');
 await input.fill('new');
 await expect(page.getByTestId('count-o200k-zh')).toHaveText('3');
 await expect(page.getByTestId('count-community-zh')).toHaveText('≈ 3');
 // Observe past the deliberately delayed response, not just its initial optimistic state.
 await page.waitForTimeout(350);
 await expect(page.getByTestId('count-o200k-zh')).toHaveText('3');
 await expect(page.getByTestId('count-community-zh')).toHaveText('≈ 3');
 await expect(input).toHaveValue('new');
});
