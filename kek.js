const express = require('express');  // Mengimpor modul express untuk membuat aplikasi web
const webdriverio = require('webdriverio');  // Mengimpor modul webdriverio untuk otomatisasi pengujian
const bodyParser = require('body-parser');  // Mengimpor modul body-parser untuk memparsing body permintaan HTTP

const app = express();  // Membuat instance aplikasi Express
const port = 3000;  // Menentukan port yang akan digunakan oleh aplikasi

// Middleware untuk mengizinkan penggunaan body-parser
app.use(bodyParser.json());

// Routes endpoint untuk menjalankan KEK PSAM BNI (POST)
app.post('/runKEK', async (req, res) => {
  let client;

  try {
    const dataPairs = req.body.dataPairs;  // Mendapatkan dataPairs dari body permintaan HTTP
    const failedPairs = [];  // Inisialisasi array untuk menampung dataPairs yang gagal

    // Membuat koneksi dengan WebDriverIO
    client = await webdriverio.remote({
      hostname : '127.0.0.1',
      port: 4723, 
      capabilities: {
        platformName: 'Android', 
        "appium:uiid": "PBM1229P30869", 
        "appium:platformVersion": "7.1.1",  
        'appium:appPackage': 'com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo',  
        'appium:appActivity': 'com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo.MainActivity',  
        "appium:automationName": "UiAutomator2"  
      },
    });

    // Fungsi untuk runKEK pada setiap pasangan dataPairs
    async function runKEK(pair) {
      try {
        const buttonPersoBNI = await client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/cardBniPerso"]')
        buttonPersoBNI.click();
        const listDevice = await client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/rcvTotal"]');
        await listDevice.waitForDisplayed();

        // Mengklik elemen untuk mkey
        await client.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("' + pair.mkey + '")').click();
        await client.pause(1000);

        // Mengklik elemen untuk tid
        await client.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("' + pair.tid + '")').click();
        await client.pause(1000);

        // Tekan tombol "Back" pada perangkat Android
        await client.pressKeyCode(4); 
        await client.pause(1000);

        // Lanjutkan dengan tindakan berikutnya (jika ada)
        await client.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Default")').click();
        await client.pause(1000);
        await client.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Initial Now")').click();
        await client.pause(1000);

        // Menginputkan data pada input PIN (jika diperlukan)
        const inputPin = client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/txtPinInput"]')
        inputPin.setValue("12345678")
        await client.pause(1000)

        //button confirm
        const buttonConfirm = client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/btnConfim"]')
        buttonConfirm.click()
        await client.pause(5000)

        //button oke
        const buttonOke = client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/btnCancel"]')
        buttonOke.click()
        await client.pause(2000)

        //button pressback
        const back1 = client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/icBack"]')
        back1.click()
        await client.pause(1000);

        //button pressback
        const back2 = client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/icBack"]')
        back2.click()
        await client.pause(1000);

        console.log("Proses KEK selesai")
      } catch (error) {
        console.error("KEK gagal untuk data mkey:", pair.mkey, "dan tid:", pair.tid)
        failedPairs.push(pair) // Menyimpan dataPairs yang gagal ke array failedPairs
        await client.back()
        await client.pause(1000)
        const home = await client.$('[resource-id="com.mkpmobile.apps2pay.sunmi.sdk.apps2pay_sdk_demo:id/action_bar_root"]');
        await home.waitForDisplayed()
      }
    }

    // Iterasi melalui setiap pasangan dataPairs
    for (const pair of dataPairs) {
      await runKEK(pair);
    }

    // Response sesuai dengan hasil KEK
    if (failedPairs.length === 0) {
      console.log("Semua data Mkey dan TID berhasil diKEK!!!", dataPairs)
      res.json({ message: 'Semua proses KEK berhasil!!!' })
    } else {
      console.log("Terdapat kesalahan dalam proses KEK", failedPairs)
      res.status(500).json({ message: 'Terdapat kesalahan dalam proses KEK', failedPairs: failedPairs })
    }
  } catch (error) {
    console.error(error);  // Menangani kesalahan
    res.status(500).json({ message: 'Terjadi kesalahan dalam proses KEK.', failedPairs: failedPairs });  // Merespons kesalahan
  } finally {
    await client.deleteSession();
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);  // Menampilkan pesan ketika server berjalan
});
