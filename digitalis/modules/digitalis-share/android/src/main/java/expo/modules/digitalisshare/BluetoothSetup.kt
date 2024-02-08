 package expo.modules.digitalisshare
 import android.Manifest
 import android.annotation.SuppressLint
 import android.app.Activity
 import android.bluetooth.BluetoothAdapter
 import android.bluetooth.BluetoothDevice
 import android.bluetooth.BluetoothManager
 import android.bluetooth.BluetoothServerSocket
 import android.bluetooth.BluetoothSocket
 import android.content.BroadcastReceiver
 import android.content.Context
 import android.content.Intent
 import android.content.IntentFilter
 import android.content.pm.PackageManager
 import android.util.Log
 import androidx.core.app.ActivityCompat
 import expo.modules.kotlin.AppContext
 import java.io.IOException
 import java.util.UUID

 @SuppressLint("MissingPermission")
 class BluetoothSetup {
     val ACTION_REQUEST_ENABLE = 1;
     val ACTION_FOUND = 4;
     val NAME = "Digitalis"
     val MY_UUID = UUID.randomUUID();

     var appActivity: Activity? = null;
     var bluetoothAdapter: BluetoothAdapter? = null;




     private inner class AcceptThread : Thread() {

         private val mmServerSocket: BluetoothServerSocket? by lazy(LazyThreadSafetyMode.NONE) {
             bluetoothAdapter?.listenUsingRfcommWithServiceRecord(NAME, MY_UUID)
         }

         override fun run() {
             // Keep listening until exception occurs or a socket is returned.
             var shouldLoop = true
             while (shouldLoop) {
                 val socket: BluetoothSocket? = try {
                     mmServerSocket?.accept()
                 } catch (e: IOException) {
                     Log.e("ERROR", "Socket's accept() method failed", e)
                     shouldLoop = false
                     null
                 }
                 socket?.also {
 //                    manageMyConnectedSocket(it)
                     mmServerSocket?.close()
                     shouldLoop = false
                 }
             }
         }

         // Closes the connect socket and causes the thread to finish.
         fun cancel() {
             try {
                 mmServerSocket?.close()
             } catch (e: IOException) {
                 Log.e("ERROR", "Could not close the connect socket", e)
             }
         }
     }










     private val receiver = object : BroadcastReceiver() {
         override fun onReceive(context: Context, intent: Intent) {
             val action: String? = intent.action
             when(action) {
                 BluetoothDevice.ACTION_FOUND -> {
                     // Discovery has found a device. Get the BluetoothDevice
                     // object and its info from the Intent.
                     val device: BluetoothDevice? =
                             intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                     val deviceName = device?.name
                     val deviceUUid = device?.uuids
                     val deviceHardwareAddress = device?.address // MAC address
                     println(deviceHardwareAddress)
                     DigitalisShareModule.instance.dispatch_mac_address(deviceHardwareAddress!!, deviceName!!);
                 }
             }
         }
     }


     fun onCreate(appContext: AppContext) {
         val perms = arrayListOf(
             android.Manifest.permission.BLUETOOTH,
             android.Manifest.permission.BLUETOOTH_ADMIN,
             android.Manifest.permission.BLUETOOTH_SCAN,
             android.Manifest.permission.BLUETOOTH_CONNECT,
             android.Manifest.permission.BLUETOOTH_ADVERTISE,
             android.Manifest.permission.ACCESS_FINE_LOCATION,
             android.Manifest.permission.ACCESS_COARSE_LOCATION,
         )



         appActivity = appContext.activityProvider?.currentActivity

         val applicationContext = appActivity?.applicationContext

         val bluetoothManager: BluetoothManager? = applicationContext?.getSystemService(BluetoothManager::class.java)

         bluetoothAdapter = bluetoothManager?.getAdapter();


         appActivity?.requestPermissions(perms.toTypedArray(), 1)



         if (bluetoothAdapter?.isEnabled == false) {
             val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
             if (applicationContext?.let { ActivityCompat.checkSelfPermission(it, Manifest.permission.BLUETOOTH_CONNECT) } != PackageManager.PERMISSION_GRANTED) {
                 // TODO: Consider calling
                 //    ActivityCompat#requestPermissions
                 // here to request the missing permissions, and then overriding
                 //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                 //                                          int[] grantResults)
                 // to handle the case where the user grants the permission. See the documentation
                 // for ActivityCompat#requestPermissions for more details.
                 return
             }

             appActivity?.startActivityForResult(enableBtIntent, this.ACTION_REQUEST_ENABLE);

         }

//         val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter?.bondedDevices
//
//         pairedDevices?.forEach { device ->
//             val deviceName = device.name
//             val deviceHardwareAddress = device.address // MAC address
//
//         }


     }
     fun startDiscovery() {
         val filter = IntentFilter(BluetoothDevice.ACTION_FOUND);
         appActivity?.registerReceiver(receiver, filter);
         val started = bluetoothAdapter?.startDiscovery()
     }

     fun stopDiscovery() {
         appActivity?.unregisterReceiver(receiver);
     }


     fun makeDiscoverable() {
         val requestCode = 1;
         val discoverableIntent: Intent = Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE).apply {
             putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300)
         }
         appActivity?.startActivityForResult(discoverableIntent, requestCode)
     }
     fun awaitConnection() {
         AcceptThread()
     }




 }