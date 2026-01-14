# Steps taken

- Had to install Android Studio both in Windows and Linux, so that the Android Debug Bridge (adb) daemon can be started in Windows and used in WSL.
- To test the app in the cellphone, I need to
  - Start the daemon in Windows with
    adb -a -P 5037 nodaemon server  
  - Start the app in WSL with
    npx expo start --tunnel

- Forget the thing above, there is a better way that allows LIVE DEBUGGING!
  - Run the ExpoForwarder Powershell script in Windows Powershell to add firewall rules for WSL´s forwarded ports.
  - Run expo start but setting the REACT_NATIVE_PACKAGER_HOSTNAME variables to the Windows IP.