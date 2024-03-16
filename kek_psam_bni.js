const {remote} = require('webdriverio');
const { resolve } = require('path');

describe('KEK PSAM BNI', () => { 
    it('KEK PSAM Selesai', async () => {    
        // Array berisi pasangan data mkey dan tid
        const dataPairs = [
            { mkey: "mkpxbdki2xperluasanmerchant691", tid: "91548605" },
            { mkey: "mkpxbdki2xperluasanmerchant692", tid: "91548606" },
            { mkey: "mkpxbdki2xperluasanmerchant693", tid: "91548607" },
            { mkey: "mkpxbdki2xperluasanmerchant694", tid: "91548608" },
            { mkey: "mkpxbdki2xperluasanmerchant695", tid: "91548609" },
        ];               
        
        let kekSukses = true; 
        // Loop untuk setiap pasangan data
        for (const pair of dataPairs){
            try{
                const buttonPersoBNI = await $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/cardBniPerso"]').click();
                const listDevice = await $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/rcvTotal"]');
                await listDevice.waitForDisplayed();
                // Mengklik elemen untuk mkey
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("' + pair.mkey + '")').click();
                await browser.pause(1000);

                // Mengklik elemen untuk tid
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("' + pair.tid + '")').click();
                await browser.pause(1000);

                // Tekan tombol "Back" pada perangkat Android
                await driver.pressKeyCode(4); 
                await browser.pause(1000);

                // Lanjutkan dengan tindakan berikutnya (jika ada)
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Default")').click();
                await browser.pause(1000);
                await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Initial Now")').click();
                await browser.pause(1000);

                // Menginputkan data pada input PIN (jika diperlukan)
                const inputPin = $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/txtPinInput"]').setValue("12345678");
                await browser.pause(1000);

                //button confirm
                const buttonConfirm = $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/btnConfim"]').click();
                await browser.pause(5000);

                //button oke
                const buttonOke = $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/btnCancel"]').click();
                await browser.pause(2000);

                //button pressback
                const back1 = $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/icBack"]').click();
                await browser.pause(1000);

                //button pressback
                const back2 = $('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/icBack"]').click();
                await browser.pause(1000);
            } catch (error) {
                console.error("KEK gagal untuk data mkey:", pair.mkey, "dan tid:", pair.tid);
                kekSukses = false;
                break;
            }
        }
        
        if (kekSukses){
            console.log('Semua proses KEK berhasil!!!');
        } else {
            console.log('Proses KEK gagal. Pengujian selesai.')
        }
    });
});