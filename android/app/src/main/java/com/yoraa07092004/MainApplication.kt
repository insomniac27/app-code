//package com.yoraa07092004
//
//import android.app.Application
//import com.facebook.react.PackageList
//import com.facebook.react.ReactApplication
//import com.facebook.react.ReactHost
//import com.facebook.react.ReactNativeHost
//import com.facebook.react.ReactPackage
//import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
//import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
//import com.facebook.react.defaults.DefaultReactNativeHost
//import com.facebook.soloader.SoLoader
//
//class MainApplication : Application(), ReactApplication {
//
//  override val reactNativeHost: ReactNativeHost =
//      object : DefaultReactNativeHost(this) {
//        override fun getPackages(): List<ReactPackage> =
//            PackageList(this).packages.apply {
//              // Packages that cannot be autolinked yet can be added manually here, for example:
//              // add(MyReactNativePackage())
//            }
//
//        override fun getJSMainModuleName(): String = "index"
//
//        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
//
//        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
//        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
//      }
//
//  override val reactHost: ReactHost
//    get() = getDefaultReactHost(applicationContext, reactNativeHost)
//
//  override fun onCreate() {
//    super.onCreate()
//    SoLoader.init(this, false)
//    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//      // If you opted-in for the New Architecture, we load the native entry point for this app.
//      load()
//    }
//  }
//}










package com.yoraa07092004 // Ensure this matches your applicationId in build.gradle

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Add manually linked packages here if necessary
                }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // Load the new architecture entry point if enabled
            load()
        }
    }
}







//package com.yoraa07092004
//
//import android.content.res.Configuration
//import android.app.Application
//import com.facebook.react.PackageList
//import com.facebook.react.ReactApplication
//import com.facebook.react.ReactNativeHost
//import com.facebook.react.ReactPackage
//import com.facebook.soloader.SoLoader
//import com.facebook.react.defaults.DefaultReactNativeHost
//
//class MainApplication : Application(), ReactApplication {
//
//    override val reactNativeHost: ReactNativeHost =
//        object : DefaultReactNativeHost(this) {
//            override fun getPackages(): List<ReactPackage> =
//                PackageList(this).packages.apply {
//                    // Packages that cannot be autolinked yet can be added manually here, for example:
//                    // add(MyReactNativePackage())
//                }
//
//            override fun getJSMainModuleName(): String = "index"
//
//            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
//
//            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
//            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
//        }
//
//    // Remove this method, no need to override getReactNativeHost
//    // override fun getReactNativeHost(): ReactNativeHost = reactNativeHost
//
//    override fun onCreate() {
//        super.onCreate()
//        //FirebaseApp.initializeApp(this) // Initialize Firebase
//
//        SoLoader.init(this, false)
//        // New Architecture initialization (if enabled)
//        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//            // If you opted-in for the New Architecture, we load the native entry point for this app.
//        }
//    }
//
//    override fun onConfigurationChanged(newConfig: Configuration) {
//        super.onConfigurationChanged(newConfig)
//    }
//}
