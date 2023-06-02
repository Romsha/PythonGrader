import './ParamsText.css';

export default function ParamsText(props) {
    return (
        <div className="paramsContainer">
            <div className="paramsSection">
                <div className="paramsSectionTitle">Basic Statistics</div>
                <div className="paramsSectionBody">
                    <div> # of lines </div>
                    <div> # of functions </div>
                    <div> # of classes </div>
                </div>
            </div>
            <div className="paramsSection">
                <div className="paramsSectionTitle">Style Errors</div>
                <div className="paramsSectionBody">
                    <div> % of long lines </div>
                    <div> % of long functions and classes </div>
                    <div> % of undocumented functions and classes </div>
                </div>
            </div>
        </div>
    )
}