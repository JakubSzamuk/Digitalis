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


    Events("discovery_event")

    Function("initialise") {
      bluetooth_hook = BluetoothSetup()
      bluetooth_hook!!.onCreate(appContext);
    }

    Function("startDiscovery") {
      if (bluetooth_hook == null) {
        "bluetooth_hook has not been initialised"
      }
      bluetooth_hook!!.startDiscovery();
    }
    AsyncFunction("connectTo") {mac_address: String ->
      println("attempting to connect to $mac_address")
      sendEvent(DISCOVERY_EVENT_NAME, mapOf(
              "Hello world" to "test"
      ))
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
  }
}
