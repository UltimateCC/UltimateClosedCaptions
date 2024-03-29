import { useContext, useEffect, useState } from "react";
import { config } from "../../config";
import { langList } from "../../services/langs";

import ConfigSwitch from "../ConfigSwitch";
import loadingImg from '../../assets/loading.svg';
import { SocketContext } from "../../context/SocketContext";

interface BrowserSourceProps {
    selectedLanguageCode?: string[];
	spokenLang?: string
    configLoaded: boolean;
	browserSourceEnabled: boolean;
	updateConfig: (config: {browserSourceEnabled: boolean}) => Promise<void>
	userId: string;
}

function BrowserSource({ selectedLanguageCode, spokenLang, browserSourceEnabled, updateConfig, configLoaded, userId }: BrowserSourceProps) {
	const { reloadConfig } = useContext(SocketContext);
	const [url, setUrl] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

	const [fontFamily, setFontFamily] = useState<string>('Arial');
	const [fontColor, setFontColor] = useState<string>('#E0E0E0');
	const [bgColor, setBgColor] = useState<string>('#37373E');
	const [browserSrcLang, setBrowserSrcLang] = useState<string>("");

	function copyUrl() {
		navigator.clipboard.writeText(url)
		.then(()=>{
			setCopied(true);
		})
		.catch(e=>console.error('Error writing to clipboard', e));
	}

	function handleBrowserSourceChange(val: boolean) {
		updateConfig({ browserSourceEnabled: val })
		.then(() => {
			reloadConfig();
		})
		.catch(err => {
			console.error('Error updating browser source', err);
		});
	}

	useEffect(() => {
		const url = new URL(location.origin + '/browsersource.html');
		url.searchParams.set('userId', userId);
		if(browserSrcLang) url.searchParams.set('lang', browserSrcLang);
		if(fontFamily) url.searchParams.set('font', fontFamily);
		if(fontColor) url.searchParams.set('color', fontColor);
		if(bgColor) url.searchParams.set('bg', bgColor);
		setUrl(url.toString());
	}, [fontFamily, fontColor, bgColor, browserSrcLang, userId]);

	if(!configLoaded || userId === "" || (browserSourceEnabled && !url)) {
		return (<img src={loadingImg} alt="loading" className="loading-img" />);
	}

	return (
		<div className="browser-source">
			<p>
				Integrate your closed captions in your stream scenes via a browser source.
				While this allows your subtitles to be visible on other streaming platforms or VODs,
				viewers won't be able to customize or hide them like when using the Twitch extension.
				<br/>
				This method also introduces some delay especially when using translation.
			</p>
			<a href={ config.github + '/wiki/Browser-source' } target="_blank" rel="noreferrer">Read more</a>
            <ConfigSwitch
                checked={browserSourceEnabled}
                onChange={handleBrowserSourceChange}
                label="Enable browser source"
            />

			{ browserSourceEnabled && 
				<>
					<div className="optional-styling">
						<div className="styling-inputs">
							<h4>Settings (optional)</h4>
							<div>
								<label>
									Choose language
									<select className="theme-select" value={browserSrcLang} onChange={e=>setBrowserSrcLang(e.target.value)}>
										<option value="">Spoken language { (spokenLang && langList[spokenLang.substring(0, 2)]) ? "(" + langList[spokenLang.substring(0, 2)] + ")" : "" }</option>
										{ selectedLanguageCode?.map(code => ( <option value={code} key={code}>{langList[code]}</option> ) ) }
									</select>
								</label>

								<label>
									Select font
									<select className="theme-select" value={fontFamily} onChange={e=>{setFontFamily(e.target.value); setCopied(false)}} >
										<option value="Arial">Arial</option>
										<option value="Calibri">Calibri</option>
										<option value="Courier New">Courier New</option>
										<option value="OpenDyslexic">OpenDyslexic</option>
										<option value="Roboto">Roboto</option>
										<option value="Times New Roman">Times New Roman</option>
										<option value="Verdana">Verdana</option>
									</select>
								</label>

								<label>
									Font color
									<input className="theme-color" type="color" value={fontColor} onChange={e=>{setFontColor(e.target.value); setCopied(false)}} />
								</label>

								<label>
									Background of text
									<input className="theme-color" type="color" value={bgColor} onChange={e=>{setBgColor(e.target.value); setCopied(false)}} />
								</label>
							</div>
						</div>
						<div className="preview">
							<h4>Preview</h4>
							<div className="preview-content">
								<div id="caption-container" style={{backgroundColor: bgColor}}>
									<div id="caption-content">
										<p id="caption" style={{fontFamily, color: fontColor}}>
											<span>
												Lorem ipsum dolor sit amet consectetur adipisicing elit. 
												Dicta, error ipsam nemo suscipit quidem officiis 
												magni quod dolore atque
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				
					<div className="url-container">
						<p className="url-preview">{url}</p>

						<button className={"theme-btn"} onClick={copyUrl}>
							<span>{ copied ? 'Copied !' : 'Copy url' }</span>
						</button>
					</div>
				</>
			}			
		</div>
	);
}

export default BrowserSource;