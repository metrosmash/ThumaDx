/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Activity, AlertOctagon, Info, Stethoscope, FileText, Upload, TriangleAlert, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SYSTEM_PROMPT } from './prompt';
import GisMap from './components/GisMap';
import OfflineSync from './components/OfflineSync';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TEST_CASE_SYMPTOMS = "Patient is a 3-year-old in Kano district. High fever for 2 days, coughing, and rib-side pulling.";
const TEST_CASE_VISION = "MUAC Tape reads 11.5cm (Yellow zone).";

export default function App() {
  const [symptoms, setSymptoms] = useState('');
  const [visionData, setVisionData] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTestcase = () => {
    setSymptoms(TEST_CASE_SYMPTOMS);
    setVisionData(TEST_CASE_VISION);
  };

  const runTriage = async () => {
    if (!symptoms.trim()) {
      setError("Please enter the patient's symptoms.");
      return;
    }
    setLoading(true);
    setError('');
    setResultText('');
    setParsedJson(null);

    let content = "Symptoms:\\n" + symptoms;
    if (visionData.trim()) {
      content += "\\n\\nVision API Data:\\n" + visionData;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: content,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.1,
        },
      });

      const text = response.text || "";
      
      // Parse JSON from the output block
      const jsonMatch = text.match(/```json\\n([\\s\\S]*?)\\n```/);
      let extractedJson = null;
      let markdownText = text;

      if (jsonMatch) {
        try {
          extractedJson = JSON.parse(jsonMatch[1]);
          markdownText = text.replace(jsonMatch[0], '').trim();
        } catch (e) {
          console.error("Failed to parse output JSON block", e);
        }
      }

      setResultText(markdownText);
      setParsedJson(extractedJson);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during triage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center font-bold text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ThumaDx <span className="font-light opacity-60 text-sm italic">Clinical Engine</span></span>
        </div>
        <div className="hidden sm:flex items-center space-x-6">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-widest leading-none">District Control</p>
            <p className="text-sm font-medium text-white">Kano North / Sector 4</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-700"></div>
          <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase">Live Sync Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">

        {error && (
          <Alert variant="destructive">
            <AlertOctagon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="triage" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="triage">Triage & Analysis</TabsTrigger>
            <TabsTrigger value="gis">GIS Dashboard</TabsTrigger>
            <TabsTrigger value="offline">Offline Sync</TabsTrigger>
          </TabsList>
          
          <TabsContent value="triage" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 items-start">
          
          {/* Input Section */}
          <aside className="space-y-6 flex flex-col">
            <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Patient Intake</span>
              </h2>
              <div className="space-y-5">
                
                <div className="space-y-2">
                  <Label htmlFor="symptoms" className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reported Symptoms</Label>
                  <Textarea 
                    id="symptoms" 
                    placeholder="e.g. Child has a hot body and is breathing very fast. Fever for 2 days. Cannot breastfeed."
                    className="min-h-[120px] text-sm text-slate-700 leading-relaxed border-slate-200 resize-none focus-visible:ring-slate-400"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                  <p className="text-xs text-slate-500">Include child age, symptom duration, fever status.</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <Label htmlFor="vision" className="text-[10px] text-slate-400 uppercase font-bold tracking-widest flex items-center space-x-1">
                    <Upload className="w-3 h-3 text-slate-400" /> 
                    <span>Vision API Metadata</span>
                  </Label>
                  <Input 
                    id="vision" 
                    placeholder="e.g. MUAC 11.0cm — Moderate Acute Malnutrition"
                    value={visionData}
                    onChange={(e) => setVisionData(e.target.value)}
                    className="text-sm border-slate-200 focus-visible:ring-slate-400"
                  />
                </div>

              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between gap-4">
                <Button variant="outline" onClick={handleTestcase} type="button" className="text-slate-600 border-slate-200 text-xs tracking-wide">
                  Load Profile
                </Button>
                <Button onClick={runTriage} disabled={loading} className="font-bold bg-slate-900 hover:bg-slate-800 text-white tracking-widest uppercase text-xs px-6">
                  {loading ? 'Processing...' : 'Run Triage'}
                </Button>
              </div>
            </div>

            <div className="mt-auto pt-4 flex flex-col space-y-2 items-center">
               <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold font-serif italic">
                 Decision Support Only • Not a clinical substitute
               </p>
            </div>
          </aside>

          {/* Results Section */}
          <section className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col min-h-[500px] shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Clinical Reasoning & Triage</span>
            </h2>
            
            <div className="flex-grow flex flex-col">
              {!resultText && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6 text-slate-400">
                  <Activity className="w-12 h-12 mb-4 text-slate-200" />
                  <p className="text-sm">Awaiting patient data. Execute triage to begin analysis.</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                  <p className="text-sm font-medium animate-pulse tracking-wide">Synthesizing clinical data...</p>
                </div>
              )}

              {!loading && resultText && (
                <div className="space-y-8">
                    
                    {/* Render the Structured JSON Output first if available for high visibility */}
                    {parsedJson && (
                      <div className={`rounded-xl p-6 mb-8 text-white flex items-center justify-between shadow-lg ${
                        parsedJson.alert_level?.toLowerCase() === 'red' ? 'bg-red-600 shadow-red-100' :
                        parsedJson.alert_level?.toLowerCase() === 'yellow' ? 'bg-amber-600 shadow-amber-100' :
                        'bg-slate-800 shadow-slate-200'
                      }`}>
                        <div>
                          <h1 className="text-4xl font-black tracking-tighter">
                            {parsedJson.alert_level?.toLowerCase() === 'red' ? 'CRITICAL REFERRAL' : 
                             parsedJson.alert_level?.toLowerCase() === 'yellow' ? 'URGENT MONITOR' : 'ROUTINE CARE'}
                          </h1>
                          <p className="text-white/90 font-medium opacity-90 mt-1">
                            {parsedJson.alert_level?.toLowerCase() === 'red' ? 'Emergency Triage Required' : 'Standard Protocol'} · Alert Level {parsedJson.alert_level || 'Unknown'}
                          </p>
                        </div>
                        {parsedJson.risk_score && (
                          <div className="bg-white/20 p-4 rounded-lg backdrop-blur-md text-right border border-white/20">
                            <p className="text-[10px] uppercase font-bold text-white opacity-80">Risk Score</p>
                            <p className="text-4xl font-black">{parsedJson.risk_score.toString().padStart(2, '0')}<span className="text-xl opacity-60 font-medium">/10</span></p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Markdown Reasoning */}
                      <div className="space-y-6">
                        <div className="markdown-body prose prose-slate prose-sm max-w-none prose-headings:text-sm prose-headings:font-bold prose-headings:text-slate-800 prose-headings:border-b prose-headings:border-slate-100 prose-headings:pb-2 prose-headings:uppercase prose-headings:tracking-tight">
                          <Markdown>{resultText}</Markdown>
                        </div>
                      </div>

                      {/* CHV Instruction & Code Output */}
                      <div className="space-y-6">
                        {parsedJson && parsedJson.chv_action && (
                          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-md">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Instruction for CHV</h3>
                            <p className="text-lg leading-relaxed font-medium mb-6">
                              {parsedJson.chv_action}
                            </p>
                            <div className="p-4 bg-white/5 rounded border border-white/10">
                              <p className="text-[10px] text-white/40 uppercase font-bold mb-1 flex justify-between">
                                <span>Supervisor Summary</span>
                                {parsedJson.disease_flag && <span className="text-amber-400">{parsedJson.disease_flag}</span>}
                              </p>
                              <p className="text-sm italic">{parsedJson.summary_for_official || 'Review needed.'}</p>
                              
                              {parsedJson.comorbidity_flags && parsedJson.comorbidity_flags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {parsedJson.comorbidity_flags.map((flag: string, i: number) => (
                                    <span key={i} className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-700 uppercase tracking-wider">
                                      {flag.replace('_', ' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Raw JSON Debug */}
                        {parsedJson && (
                          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">GIS/Alert Data</h2>
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">JSON V.3</span>
                            </div>
                            <div className="bg-slate-900 rounded-lg p-4 font-mono text-[11px] text-emerald-400 border border-slate-800 shadow-inner overflow-x-auto">
                              <pre className="leading-5">{JSON.stringify(parsedJson, null, 2)}</pre>
                            </div>
                            
                            <div className="mt-6 space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 uppercase font-bold">Confidence</span>
                                <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(parsedJson.confidence || 0) * 100}%` }}></div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500 uppercase font-bold">Outbreak Scan</span>
                                <span className={`text-xs font-bold ${parsedJson.outbreak_flag ? 'text-red-500' : 'text-slate-400'}`}>
                                  {parsedJson.outbreak_flag ? 'ACTIVE' : 'STABLE'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
          </TabsContent>
          
          <TabsContent value="gis" className="mt-0">
            <GisMap currentPulse={parsedJson} />
          </TabsContent>
          
          <TabsContent value="offline" className="mt-0">
            <OfflineSync />
          </TabsContent>
        </Tabs>
        </main>
      </div>
  );
}
