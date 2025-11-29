// ... (imports)
  Mail, // Import Mail icon
// ...

// ... (inside Desktop component return)

       <AppContainer title="Productivity">
           <DesktopIcon label="Workspace" icon={Briefcase} onClick={() => onLaunchApp(AppView.WORKSPACE)} color="text-emerald-400"/>
           <DesktopIcon label="Browser" icon={Globe} onClick={() => onLaunchApp(AppView.BROWSER)} color="text-indigo-300"/>
           <DesktopIcon label="Storage" icon={HardDrive} onClick={() => onLaunchApp(AppView.FILES)} color="text-blue-400"/>
           <DesktopIcon label="Offline 360" icon={CloudOff} onClick={() => onLaunchApp(AppView.SS360)} color="text-orange-500"/>
           <DesktopIcon label="Badal Mail" icon={Mail} onClick={() => onLaunchApp(AppView.BADAL_MAIL)} color="text-orange-600"/>
       </AppContainer>

// ...