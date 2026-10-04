export class AudioBus {
  private context?:AudioContext; private master?:GainNode; private last=0; private ambient?:OscillatorNode[];
  volume=.35;
  private resultTimer?:ReturnType<typeof setTimeout>;
  private resultGeneration=0;
  private cancelResult(){clearTimeout(this.resultTimer);this.resultGeneration++;}
  start() {
    this.cancelResult();
    if(!this.context) {
      this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=this.volume*.22;this.master.connect(this.context.destination);
      this.ambient=[55,82.4,110.3].map((frequency,i)=>{const o=this.context!.createOscillator(),g=this.context!.createGain();o.type='sine';o.frequency.value=frequency;g.gain.value=.07/(i+1);o.connect(g);g.connect(this.master!);o.start();return o;});
    }
    void this.context.resume().catch(()=>{});
  }
  setVolume(value:number){this.volume=value;if(this.master&&this.context)this.master.gain.setTargetAtTime(value*.22,this.context.currentTime,.05);}
  pause(){this.cancelResult();if(this.context)void this.context.suspend().catch(()=>{});}
  /** Reuse the existing short cues; cancel the pending suspension on restart/menu. */
  result(ending:'dead'|'retired'){
    this.cancelResult();if(!this.context||this.volume===0)return;
    const generation=this.resultGeneration;
    void this.context.resume().then(()=>{
      if(generation!==this.resultGeneration)return;
      this.play(ending==='dead'?'dead':'upgrade');
      this.resultTimer=setTimeout(()=>{if(generation===this.resultGeneration)this.pause();},ending==='dead'?850:350);
    }).catch(()=>{});
  }
  play(kind:string) {
    if(!this.context||!this.master||this.context.state!=='running'||this.volume===0)return;
    const now=this.context.currentTime;
    if(['hit','fire','blade'].includes(kind)&&now-this.last<.075)return;
    this.last=now;
    const notes:Record<string,[number,number,number,OscillatorType]>={hit:[140,65,.07,'triangle'],blade:[260,60,.16,'sawtooth'],fire:[480,110,.15,'triangle'],frost:[750,210,.4,'sine'],lightning:[1200,80,.15,'sawtooth'],level:[440,880,.5,'sine'],upgrade:[660,990,.3,'sine'],hurt:[130,40,.2,'sawtooth'],dash:[320,70,.3,'triangle'],dead:[130,27,.8,'triangle'],won:[440,880,1.2,'sine'],heal:[520,780,.25,'sine'],boss:[70,35,1.5,'sawtooth']};
    const data=notes[kind];if(!data)return;
    const [from,to,duration,type]=data,o=this.context.createOscillator(),g=this.context.createGain();o.type=type;o.frequency.setValueAtTime(from,now);o.frequency.exponentialRampToValueAtTime(to,now+duration);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(kind==='hurt'?.3:.13,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+duration);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  destroy(){this.cancelResult();this.ambient?.forEach(o=>o.stop());void this.context?.close();}
}
