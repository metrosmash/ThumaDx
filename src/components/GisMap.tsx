import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { AlertTriangle, Activity } from 'lucide-react';

export default function GisMap({ currentPulse }: { currentPulse?: any }) {
  // Mock data for other cases in the district
  const mockCases = [
    { id: 1, pos: [8.95, 8.52], flag: 'Malaria', risk: 4, level: 'Yellow' },
    { id: 2, pos: [8.92, 8.48], flag: 'Pneumonia', risk: 6, level: 'Yellow' },
    { id: 3, pos: [8.88, 8.55], flag: 'Malnutrition', risk: 7, level: 'Red' },
    { id: 4, pos: [8.91, 8.50], flag: 'Malaria', risk: 3, level: 'Green' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-[600px] shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center space-x-2">
            <Activity className="w-5 h-5 text-red-600" />
            <span>Regional Outbreak Monitor</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Live district pulse mapping. Red nodes indicate high-risk localized events.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold">
           <span className="flex items-center space-x-1 text-slate-600"><span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span> <span>Critical</span></span>
           <span className="flex items-center space-x-1 text-slate-600 ml-4"><span className="w-3 h-3 bg-amber-500 rounded-full inline-block"></span> <span>Monitoring</span></span>
        </div>
      </div>
      <div className="flex-grow relative h-full w-full bg-slate-100">
        <MapContainer center={[8.9, 8.5]} zoom={11} className="w-full h-[500px] z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {mockCases.map(c => (
            <CircleMarker 
              key={c.id} 
              center={c.pos as [number, number]} 
              radius={8}
              pathOptions={{
                color: c.level === 'Red' ? '#dc2626' : c.level === 'Yellow' ? '#f59e0b' : '#10b981',
                fillColor: c.level === 'Red' ? '#dc2626' : c.level === 'Yellow' ? '#f59e0b' : '#10b981',
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <div className="text-xs font-sans">
                  <strong>Condition:</strong> {c.flag}<br/>
                  <strong>Risk Score:</strong> {c.risk}/10
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {currentPulse && currentPulse.coordinates && (
            <CircleMarker 
              center={currentPulse.coordinates as [number, number]} 
              radius={18}
              className="animate-pulse"
              pathOptions={{
                color: currentPulse.alert_level?.toLowerCase() === 'red' ? '#dc2626' : '#f59e0b',
                fillColor: currentPulse.alert_level?.toLowerCase() === 'red' ? '#dc2626' : '#f59e0b',
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <div className="text-xs font-sans">
                  <strong className="text-red-600 flex items-center space-x-1"><AlertTriangle className="w-3 h-3"/> <span>NEW CASE INCIDENT</span></strong>
                  <strong>Condition:</strong> {currentPulse.disease_flag}<br/>
                  <strong>Risk Score:</strong> {currentPulse.risk_score}/10<br/>
                  <strong>Outbreak Flag:</strong> {currentPulse.outbreak_flag ? 'TRUE' : 'FALSE' }
                </div>
              </Popup>
            </CircleMarker>
          )}

        </MapContainer>
        
        {/* Mock Outbreak Overlay if true */}
        {currentPulse?.outbreak_flag && (
           <div className="absolute top-4 left-0 right-0 mx-auto w-max z-[1000] bg-red-600 text-white px-4 py-2 rounded-full shadow-lg border border-red-500 font-bold uppercase tracking-wider text-xs flex items-center space-x-2 animate-bounce">
              <AlertTriangle className="w-4 h-4" />
              <span>Outbreak Threshold Reached: Immediate Response Triggered</span>
           </div>
        )}

      </div>
    </div>
  );
}
