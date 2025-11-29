import React, { useEffect, useState, useRef } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "[    0.000000] Linux version 6.8.0-megam-generic (root@build-server) (gcc version 13.2.0)",
  "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-6.8.0 root=UUID=cloud-os-root ro quiet splash",
  "[    0.002341] e820: BIOS-provided physical RAM map:",
  "[    0.002342] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
  "[    0.002344] BIOS-e820: [mem 0x0000000000100000-0x000000007fffffff] usable",
  "[    0.045000] smp: Bringing up secondary CPUs...",
  "[    0.052000] x86: Booting SMP configuration:",
  "[    0.055000] .... node  #0, CPUs:      #1 #2 #3 #4 #5 #6 #7",
  "[    0.120000] NET: Registered protocol family 16",
  "[    0.150000] pci 0000:00:02.0: vgaarb: setting as boot VGA device",
  "[    0.200000] scsi host0: Ahci",
  "[    0.210000] scsi host1: Ahci",
  "[    0.350000] Write protecting the kernel read-only data: 26624k",
  "[    0.500000] Freeing unused kernel image (initmem) memory: 2048k",
  "[    0.510000] Run /init as init process",
  "[    0.800000] systemd[1]: Detected architecture x86-64.",
  "[    0.810000] systemd[1]: Set hostname to <megam-cloud>.",
  "[    1.200000] [ OK ] Reached target Local File Systems.",
  "[    1.400000] [ OK ] Started Network Manager.",
  "[    1.500000] [ OK ] Started Docker Application Container Engine.",
  "[    1.600000] [ OK ] Started Kubernetes Kubelet.",
  "[    1.700000] [ OK ] Started Neural Bridge AI Adapter.",
  "[    1.800000] [ OK ] Started PostgreSQL Cluster 16-main.",
  "[    1.900000] [ OK ] Started OpenSSH Server.",
  "[    2.000000] [ OK ] Reached target Multi-User System.",
  "[    2.100000] [ OK ] Reached target Graphical Interface.",
  "Welcome to Megam OS v2.0 LTS",
  "Initializing Desktop Environment..."
];

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= BOOT_LOGS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      // Ensure we don't access undefined if something goes wrong with bounds
      const nextLog = BOOT_LOGS[currentIndex];
      if (nextLog) {
          setLogs(prev => [...prev, nextLog]);
      }
      currentIndex++;
    }, 100); // Speed of log scrolling

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="h-full w-full bg-black text-slate-300 font-mono text-sm p-8 overflow-hidden flex flex-col cursor-none select-none">
       {logs.map((log, i) => (
         <div key={i} className="whitespace-pre-wrap break-all">
            {log && log.includes('[ OK ]') ? (
              <>
                <span className="text-green-500 font-bold">[ OK ]</span> {log.replace('[ OK ]', '')}
              </>
            ) : log && log.includes('FAILED') ? (
               <>
                <span className="text-red-500 font-bold">[FAILED]</span> {log.replace('[FAILED]', '')}
              </>
            ) : (
              log || ''
            )}
         </div>
       ))}
       <div ref={bottomRef} />
       <div className="w-4 h-8 bg-slate-300 animate-pulse mt-1"></div>
    </div>
  );
};

export default BootSequence;