package expo.modules.digitalisshare

import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DigitalisShareModule : Module() {

  private var bluetooth_hook: BluetoothSetup? = null
  val DISCOVERY_EVENT_NAME = "onFoundDevice"

  companion object {
    public lateinit var instance: DigitalisShareModule
  }

  init {
      instance = this
  }

  public fun dispatch_mac_address(addr: String, name: String) {
    sendEvent(DISCOVERY_EVENT_NAME, mapOf(
            "mac_address" to addr,
            "device_name" to name
    ))
  }
  override fun definition() = ModuleDefinition {

    Name("DigitalisShare")

    Events(DISCOVERY_EVENT_NAME)

    Function("initialise") {
      bluetooth_hook = BluetoothSetup()
      bluetooth_hook!!.onCreate(appContext);
    }
    Function("isInitialised") {
      bluetooth_hook != null
    }

    Function("startDiscovery") {
      if (bluetooth_hook == null) {
        println("bluetooth_hook has not been initialised")
        "Unintialised"
      }
      instance = this@DigitalisShareModule;
      bluetooth_hook!!.startDiscovery();
    }
    Function("stopDiscovery") {
      if (bluetooth_hook == null) {
        "uninitialised"
      }
      bluetooth_hook!!.connect_to_device();
    }
    Function("makeDiscoverable") {
      if (bluetooth_hook == null) {
        println("Bluetooth hook has not been initialised")
        "Unintialised"
      }
      bluetooth_hook!!.makeDiscoverable();
    }
    AsyncFunction("connectTo") {mac_address: String ->
      bluetooth_hook.
    }
  }
}
