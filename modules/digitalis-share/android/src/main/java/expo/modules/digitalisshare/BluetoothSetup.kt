package expo.modules.digitalisshare
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
import android.util.Log
import expo.modules.kotlin.AppContext
import java.io.IOException
import java.lang.Error
import java.util.UUID

@SuppressLint("MissingPermission")
class BluetoothSetup {
    val ACTION_REQUEST_ENABLE = 1;
    val ACTION_FOUND = 4;
    val NAME = "Digitalis"
    val MY_UUID = UUID.randomUUID();


    var AppActivity: Activity? = null;
    var BluetoothCreatedAdapter: BluetoothAdapter? = null;



    private inner class AcceptThread : Thread() {

        private val mmServerSocket: BluetoothServerSocket? by lazy(LazyThreadSafetyMode.NONE) {
            BluetoothCreatedAdapter?.listenUsingRfcommWithServiceRecord(NAME, MY_UUID)
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
        @SuppressLint("MissingPermission")
        override fun onReceive(context: Context, intent: Intent) {
            val action: String? = intent.action
            println("Hello world")
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
                    println("Hello world")
                }
            }
        }
    }


    @SuppressLint("MissingPermission")
    fun onCreate(appContext: AppContext) {
        AppActivity = appContext.activityProvider?.currentActivity
        val applicationContext = AppActivity?.applicationContext

        val bluetoothManager: BluetoothManager? = applicationContext?.getSystemService(BluetoothManager::class.java)
        BluetoothCreatedAdapter = bluetoothManager?.getAdapter();

        if (BluetoothCreatedAdapter == null) {
//            return Error("No Bluetooth support On this device");
        }

        if (BluetoothCreatedAdapter?.isEnabled == false) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);

            AppActivity?.startActivityForResult(enableBtIntent, this.ACTION_REQUEST_ENABLE);
        }
    }
    fun startDiscovery() {
        val filter = IntentFilter(BluetoothDevice.ACTION_FOUND);
        AppActivity?.registerReceiver(receiver, filter);
        println("Hello world")
    }

    fun stopDiscovery() {
        AppActivity?.unregisterReceiver(receiver);
    }


    fun makeDiscoverable() {
        val requestCode = 1;
        val discoverableIntent: Intent = Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE).apply {
            putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300)
        }
        AppActivity?.startActivityForResult(discoverableIntent, requestCode)
    }
    fun awaitConnection() {
        AcceptThread()
    }




}