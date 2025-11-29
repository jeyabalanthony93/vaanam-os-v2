// ... 
             <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                <MenuButton label="Terminal" onClick={() => { onLaunchApp(AppView.TERMINAL); setMenuOpen(false); }} />
                <MenuButton label="Megam Browser" onClick={() => { onLaunchApp(AppView.BROWSER); setMenuOpen(false); }} />
                <MenuButton label="Badal Apps" onClick={() => { onLaunchApp(AppView.WORKSPACE); setMenuOpen(false); }} />
                <MenuButton label="Server Admin" onClick={() => { onLaunchApp(AppView.SERVER); setMenuOpen(false); }} />
                <MenuButton label="Badal Storage" onClick={() => { onLaunchApp(AppView.FILES); setMenuOpen(false); }} />
                <MenuButton label="Badal Mail" onClick={() => { onLaunchApp(AppView.BADAL_MAIL); setMenuOpen(false); }} />
                <MenuButton label="Infrastructure" onClick={() => { onLaunchApp(AppView.INFRASTRUCTURE); setMenuOpen(false); }} />
// ...