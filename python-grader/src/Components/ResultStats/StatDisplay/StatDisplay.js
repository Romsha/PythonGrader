import './StatDisplay.css';
import {useEffect, useRef, useState} from 'react'

export const TYPES = {
    PERC: 'PERC',
    NUMBER: 'NUMBER',
    BOOL: 'BOOL'
};

export default function StatDispay(props) {
    const componentRef = useRef(null);
    const [seen, setSeen] = useState(false);
    const [perc, setPerc] = useState(0);

    useEffect(() => {
        if (props.type !== TYPES.PERC) { return () => {} }
            
        const observer = new IntersectionObserver((entries) => {
            if (seen) {
                if (componentRef.current) { observer.unobserve(componentRef.current); }
            } else {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setSeen(true);
                    setPerc(Math.round(props.data / 100 * 180));
                }
            }
        });

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) { observer.unobserve(componentRef.current); }
        };
    }, []);

    if (props.type === TYPES.PERC) {

        var gaugeCls = 'badGauge';
        if (props.data > 66) {
            gaugeCls = 'goodGauge';
        } else if (props.data > 33) {
            gaugeCls = 'medGauge';
        }

        return (
            <div className={"statContainer " + (props.hasOwnProperty('total') ? 'statTotal' : '')} ref={componentRef}>
                <div className={"gauge " + gaugeCls}>
                    <div className="percentage" style={{ transform: `rotate(${perc}deg)` }}></div>
                    <div className="mask"></div>
                    <span className="value">{props.data}<span className="statDataUnit">%</span></span>
                </div>
                <div className="statLabel">{props.label}</div>
            </div>
        );
    };

    var boolClass = '';
    if (props.type === TYPES.BOOL) {
        boolClass += (props.value ? 'statGood' : 'statBad');
    };

    return (
        <div className="statContainer">
            <div className={"statData " + boolClass}>{props.data}</div>
            <div className="statLabel">{props.label}</div>
        </div>
    );

};

