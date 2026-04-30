import { WifiOff, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OfflineSync() {
  const syncQueue = [
    { id: 'ca-921', time: '14 mins ago', status: 'Pending Sync', type: 'Triage Assessment' },
    { id: 'ca-920', time: '42 mins ago', status: 'Pending Sync', type: 'Triage Assessment' },
    { id: 'img-11', time: '1 hour ago', status: 'Pending Sync', type: 'Edge Vision Inference Result' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-800 flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-slate-500" />
            <span>Local Storage Queue</span>
          </CardTitle>
          <CardDescription>Cases waiting for network sync.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
           <ul className="space-y-4">
              {syncQueue.map((item, idx) => (
                 <li key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded shadow-sm">
                    <div>
                       <p className="text-xs font-bold text-slate-700 uppercase">{item.id}</p>
                       <p className="text-[10px] text-slate-500">{item.type}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">{item.status}</span>
                       <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
                    </div>
                 </li>
              ))}
           </ul>
           <button className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest py-3 rounded border border-slate-200 transition-colors">
              Force Sync Now
           </button>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader className="bg-slate-900 border-b border-slate-800 text-white">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-100 flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Edge Inference Layer</span>
          </CardTitle>
          <CardDescription className="text-slate-400">On-device vision model status.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-slate-900 text-slate-300 rounded-b-xl h-full pb-10">
           <div className="space-y-4">
              <p className="text-xs leading-relaxed">
                 The ThumaDx vision module utilizes a quantized TensorFlow Lite model running natively on the device.
              </p>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Current Model Version</p>
                 <p className="font-mono text-xs text-emerald-400">v2.4.1-quantized-muac</p>
              </div>
               <div className="p-3 bg-slate-800 rounded border border-slate-700">
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Performance Metrics</p>
                 <ul className="text-xs font-mono space-y-1">
                    <li>Avg Inference Time: <span className="text-white">124ms</span></li>
                    <li>Power Draw: <span className="text-white">Low</span></li>
                    <li>Accuracy (Local): <span className="text-white">92.4%</span></li>
                 </ul>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
