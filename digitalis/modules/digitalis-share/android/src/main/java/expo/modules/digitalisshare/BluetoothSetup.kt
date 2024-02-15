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
 import android.os.ParcelUuid
 import android.util.Log
 import androidx.core.app.ActivityCompat
 import expo.modules.kotlin.AppContext
 import kotlinx.coroutines.delay
 import java.io.IOException
 import java.util.UUID
 import kotlin.time.Duration

 @SuppressLint("MissingPermission")
 class BluetoothSetup {
     val ACTION_REQUEST_ENABLE = 1;
     val ACTION_FOUND = 4;
     val NAME = "Digitalis"
     private val MY_UUID: UUID = ParcelUuid.fromString("0000112f-0000-1000-8000-00805f9b34fb").uuid


     var appActivity: Activity? = null;
     var bluetoothAdapter: BluetoothAdapter? = null;




     private inner class AcceptThread : Thread() {

         private val mmServerSocket: BluetoothServerSocket? by lazy(LazyThreadSafetyMode.NONE) {
             bluetoothAdapter?.listenUsingRfcommWithServiceRecord(NAME, MY_UUID)
         }

         var serverSocket: BluetoothServerSocket? = null;
         var lookforConnections = true
         override fun run() {
             // Keep listening until exception occurs or a socket is returned.
//             var shouldLoop = true
//             while (shouldLoop) {
//                 val socket: BluetoothSocket? = try {
//                     mmServerSocket?.accept()
//                 } catch (e: IOException) {
//                     Log.e("ERROR", "Socket's accept() method failed", e)
//                     shouldLoop = false
//                     null
//                 }
//                 println("Connection request")
//
//                 socket?.also {
// //                    manageMyConnectedSocket(it)
//                     mmServerSocket?.close()
//                     shouldLoop = false
//                 }
//             }

             var shouldLoop = true;
             while (shouldLoop) {
                 println("About to try accept")
                 println("before")
                 val bluetooth_socket = try {
                     var socket = mmServerSocket!!.accept()
                     println("accept")
                     socket
                 } catch (e: IOException) {
                     println("error ")
                     shouldLoop = false;
                     break
                 }

                 if (bluetooth_socket.isConnected) {
                    println("CONNECTION HERE")
                    shouldLoop = false;
                }
                 println(bluetooth_socket)
             }


//             serverSocket = try {
//                 bluetoothAdapter!!.listenUsingRfcommWithServiceRecord(NAME, MY_UUID)
//             } catch (e: IOException) {
//                 Log.e("com.digitalis.digitalis", "Exception", e)
//                 return
//             } catch (e: SecurityException) {
//                 Log.e("com.digitalis.digitalis", "Missing permission for Connect", e)
//                 return
//             }
//             try {
//                 while (lookforConnections) {
//                     val socket = serverSocket!!.accept()
//                     connect(socket)
//                 } catch (e: Exception) {
//
//                 }
//             }
         }

         private fun connect(socket: BluetoothSocket) {
//             synchronized(sockets)
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



     private inner class ConnectThread(device: BluetoothDevice) : Thread() {

         private val mmSocket: BluetoothSocket? by lazy(LazyThreadSafetyMode.NONE) {
             device.createRfcommSocketToServiceRecord(MY_UUID)
         }

         public override fun run() {
             // Cancel discovery because it otherwise slows down the connection.
             bluetoothAdapter?.cancelDiscovery()

             mmSocket?.let { socket ->
                 // Connect to the remote device through the socket. This call blocks
                 // until it succeeds or throws an exception.
                 println("ABOUT TO TRY TO CONNECT")
                 socket.connect()

                 // The connection attempt succeeded. Perform work associated with
                 // the connection in a separate thread.
                 println("CONNECTED")
                 Thread.sleep(10000)
             }
         }

         // Closes the client socket and causes the thread to finish.
         fun cancel() {
             try {
                 println("Trying to close socket")
                 mmSocket?.close()
             } catch (e: IOException) {
                 Log.e("no", "Could not close the client socket", e)
             }
         }
     }
     var foundDevice: BluetoothDevice? = null

    fun connect_to_device() {
        val connectThread = ConnectThread(foundDevice!!)
        connectThread.start()
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
                     if (device != null) {
                         if (device.name == "Pixel 8 Pro") {
                             this@BluetoothSetup.foundDevice = device
                             println("FOUND THE PIXEL")
                             this@BluetoothSetup.stopDiscovery();
                             return
                         }
                         if (device.name != null && device.uuids != null && device.address != null) {
                             val deviceName = device.name
                             val deviceUUid = device.uuids
                             val deviceHardwareAddress = device.address // MAC address
                             println("$deviceHardwareAddress, $deviceName, $deviceUUid")


                             DigitalisShareModule.instance.dispatch_mac_address(deviceHardwareAddress!!, deviceName!!);
                         } else {
                             println("BAD DEVICE")
                         }
                     }
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
         bluetoothAdapter!!.cancelDiscovery();
     }


     fun makeDiscoverable() {
         val requestCode = 1;
         val discoverableIntent: Intent = Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE).apply {
             putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300)
         }
         appActivity?.startActivityForResult(discoverableIntent, requestCode)
         val acceptThread = AcceptThread()
         acceptThread.start()
     }




 }