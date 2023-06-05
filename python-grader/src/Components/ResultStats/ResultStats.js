import './ResultStats.css';
import { useEffect } from 'react';
import { animateScroll } from 'react-scroll';
import StatDisplay, {TYPES as STATS_TYPES} from './StatDisplay/StatDisplay'

export default function ResultStats(props) {
    useEffect(() => {
        animateScroll.scrollToBottom({
          duration: 1500, 
          delay: 100, 
          smooth: true,
        });
    }, []);

    const grades = {
        longLines: 100-Math.round(props.data.data.numLongLines * 100.0 / props.data.data.numNotEmptyLines),
        docClasses: Math.round(props.data.data.numDocClasses * 100.0 / props.data.data.numClasses),
        docFuncs: Math.round(props.data.data.numDocFuncs * 100.0 /props.data.data.numFuncs),
        longClasses: 100-Math.round(props.data.data.numBigClasses * 100.0 / props.data.data.numClasses),
        longFuncs: 100-Math.round(props.data.data.numLongFuncs * 100.0 /props.data.data.numFuncs),
        docSize: props.data.data.isDocBig ? 50 : 100
    }
    const totalGrage = Math.round(Object.values(grades).reduce((sum, cur) => (sum+cur), 0) / Object.values(grades).length);

    return (
        <div className="statsContainer">
            <h1 className="statsTitle title">Stats for file: {props.data.name}</h1>
            <div className="resultsContainer">
                <h2 className="resultsRowTitle">Basic<br/>Stats:</h2>
                <StatDisplay type={STATS_TYPES.NUMBER} data={1} label="files" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={props.data.data.numNotEmptyLines} label="lines" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={props.data.data.numClasses} label="classes" />
                <StatDisplay type={STATS_TYPES.NUMBER} data={props.data.data.numFuncs} label="functions" />

                <h2 className="resultsRowTitle">Style<br/>Stats:</h2>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={grades.longLines} 
                    label="good length lines" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={grades.docClasses} 
                    label="documented classes" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={grades.docFuncs} 
                    label="documented functions" />
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={grades.longClasses} 
                    label="good length classes" />
                
                <div/>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={grades.longFuncs} 
                    label="good length functions" />
                <StatDisplay 
                    type={STATS_TYPES.BOOL} 
                    value={!props.data.data.isDocBig}
                    data={props.data.data.isDocBig ? 'Too Big' : 'Great'} 
                    label="module size" />
                <div/>
                <StatDisplay 
                    type={STATS_TYPES.PERC} 
                    data={totalGrage} 
                    total={true}
                    label="total grade" />
            </div>
        </div>
    )
}