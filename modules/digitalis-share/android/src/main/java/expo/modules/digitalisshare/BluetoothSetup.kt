package expo.modules.digitalisshare
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import expo.modules.kotlin.AppContext
import java.lang.Error

class BluetoothSetup {
    val ACTION_REQUEST_ENABLE = 1;
    val ACTION_FOUND = 4;

    @SuppressLint("MissingPermission")
    fun onCreate(appContext: AppContext) {
        val activity = appContext.activityProvider?.currentActivity
        val applicationContext = activity?.applicationContext

        val bluetoothManager: BluetoothManager? = applicationContext?.getSystemService(BluetoothManager::class.java)
        val bluetoothAdapter: BluetoothAdapter? = bluetoothManager?.adapter;

        if (bluetoothAdapter == null) {
//            return Error("No Bluetooth support On this device");
        }

        if (bluetoothAdapter?.isEnabled == false) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);

            activity.startActivityForResult(enableBtIntent, this.ACTION_REQUEST_ENABLE);
        }
    }
    fun startDiscovery(appContext: AppContext) {
        val activity = appContext.activityProvider?.currentActivity
        val applicationContext = activity?.applicationContext


        val receiver = object : BroadcastReceiver() {
            @SuppressLint("MissingPermission")
            override fun onReceive(context: Context, intent: Intent) {
                val action: String? = intent.action
                when(action) {
                    BluetoothDevice.ACTION_FOUND -> {
                        // Discovery has found a device. Get the BluetoothDevice
                        // object and its info from the Intent.
                        val device: BluetoothDevice? =
                                intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                        val deviceName = device?.name
                        val deviceHardwareAddress = device?.address // MAC address
                        println(deviceHardwareAddress)
                    }
                }
            }
        }

        val filter = IntentFilter(BluetoothDevice.ACTION_FOUND);
        activity?.registerReceiver(receiver, filter);
    }


}