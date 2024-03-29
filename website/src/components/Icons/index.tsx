function Icons({ name }: { name: string }) {
    switch (name) {
        case 'twitch':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 14.78 13.8">
                    <path d="M2.46.97l-.81,2.06v8.42h2.87v1.52h1.61l1.52-1.52h2.33l3.13-3.13V.97H2.46ZM12.05,7.78l-1.79,1.79h-2.87l-1.52,1.52v-1.52h-2.42V2.05h8.6v5.73ZM10.26,4.11v3.13h-1.07v-3.13s1.07,0,1.07,0ZM7.39,4.11v3.13h-1.07v-3.13s1.07,0,1.07,0Z"/>
                </svg>
            );

        case 'github':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 14.78 13.8">
                    <path d="M7.39,1.14C4.15,1.14,1.53,3.78,1.53,7.05c0,2.61,1.68,4.82,4.01,5.6.29.06.4-.13.4-.28,0-.14,0-.61,0-1.1-1.63.35-1.97-.7-1.97-.7-.26-.68-.65-.86-.65-.86-.53-.36.04-.36.04-.36.59.04.9.61.9.61.52.9,1.37.65,1.71.49.05-.38.2-.65.37-.79-1.3-.14-2.67-.65-2.67-2.91,0-.65.23-1.17.6-1.58-.06-.15-.26-.75.06-1.56,0,0,.49-.16,1.61.61.48-.13.97-.2,1.47-.2.49,0,1,.07,1.47.2,1.12-.76,1.61-.61,1.61-.61.32.81.12,1.42.06,1.56.38.41.6.94.6,1.58,0,2.27-1.37,2.77-2.68,2.91.21.19.4.54.4,1.1,0,.79,0,1.43,0,1.62,0,.16.11.34.4.28,2.33-.78,4.01-2.99,4.01-5.6,0-3.27-2.62-5.91-5.85-5.91Z"/>
                </svg>
            );

        case 'discord':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1em" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            );

        case 'translate':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/>
                </svg>
            );

        case 'mic':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/>
                </svg>
            );

        case 'book':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z"/>  
                </svg>
            );
            
        case 'blocked':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/>
                </svg>
            );

        case 'obs':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14.78 13.8">
                    <path d="M7.11.71s-.08,0-.14,0c-.14,0-.32.03-.47.05-1.64.24-3.09,1.1-4.07,2.41-.17.22-.3.43-.44.67-.62,1.09-.89,2.35-.78,3.6.1,1.12.5,2.19,1.16,3.09.2.28.38.49.64.75.47.47.98.84,1.58,1.14.66.33,1.35.54,2.07.63.27.03.35.04.71.04.35,0,.41,0,.67-.03,1.47-.16,2.85-.84,3.84-1.89.43-.46.76-.93,1.04-1.48.39-.76.59-1.52.66-2.4.01-.14.01-.62,0-.77-.05-.7-.19-1.33-.44-1.95-.26-.65-.62-1.23-1.1-1.78-.1-.11-.43-.44-.55-.54-.63-.55-1.33-.95-2.1-1.22-.54-.18-1.07-.29-1.66-.32-.1,0-.55,0-.61,0ZM7.8,1.93c.57.05,1.09.18,1.59.4.13.06.38.19.5.26.53.31.98.7,1.36,1.16.63.78,1.01,1.72,1.1,2.72.01.13.02.44.01.5v.06s-.01-.05-.01-.05c-.03-.15-.11-.43-.18-.6-.1-.26-.21-.47-.37-.71-.24-.35-.5-.64-.84-.89-.43-.32-.9-.54-1.44-.65-.07-.02-.13-.03-.13-.03,0,0,0,.04-.02.09-.04.25-.08.39-.19.61-.1.21-.22.37-.37.52-.28.28-.63.47-1.02.55-.33.07-.68.05-1-.05-.42-.13-.81-.42-1.06-.79-.17-.25-.27-.51-.32-.82-.02-.1-.02-.12-.02-.31,0-.17,0-.21.01-.29.06-.35.18-.64.39-.92.08-.1.24-.27.34-.35.31-.25.69-.4,1.09-.43.09,0,.42,0,.57,0ZM4.98,2.55c-.13.11-.32.31-.43.45-.41.51-.68,1.12-.77,1.77-.03.21-.03.27-.03.52,0,.3.02.48.07.74.03.16.13.5.14.52,0,0,.05-.01.11-.03.26-.1.47-.14.74-.14.5,0,.96.18,1.34.51.27.24.49.59.59.94.05.17.07.3.07.49,0,.34-.06.65-.21.95-.27.55-.77.94-1.37,1.07-.27.06-.58.06-.85,0-.54-.11-1.01-.46-1.3-.93-.18-.29-.36-.7-.46-1.06-.14-.45-.21-.88-.22-1.36-.02-1.12.33-2.2,1.02-3.11.22-.3.52-.6.82-.85.16-.13.37-.28.56-.4.07-.04.22-.13.22-.13,0,0-.02.02-.04.04ZM10.2,6.41c.11.01.23.04.33.07.66.2,1.16.69,1.35,1.35.09.29.11.61.06.9-.02.14-.1.39-.14.46-.11.2-.15.28-.29.48-.34.52-.82,1-1.34,1.35-.65.44-1.38.71-2.15.82-.35.05-.79.05-1.15.02-.54-.06-1.1-.21-1.59-.44-.17-.08-.5-.26-.49-.27,0,0,.02,0,.04.01.22.08.51.14.79.17.13.01.54.02.66,0,.47-.04.92-.17,1.36-.4.41-.21.74-.47,1.06-.82l.08-.09-.08-.07c-.25-.21-.42-.43-.55-.7-.11-.22-.17-.43-.19-.66-.01-.13,0-.39,0-.51.06-.36.2-.69.44-.98.06-.07.22-.23.29-.29.16-.13.39-.25.57-.32.17-.06.37-.1.54-.12.1,0,.27,0,.38.01Z"/>
                </svg>
            );

        case 'internet':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M838-65 720-183v89h-80v-226h226v80h-90l118 118-56 57ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 20-2 40t-6 40h-82q5-20 7.5-40t2.5-40q0-20-2.5-40t-7.5-40H654q3 20 4.5 40t1.5 40q0 20-1.5 40t-4.5 40h-80q3-20 4.5-40t1.5-40q0-20-1.5-40t-4.5-40H386q-3 20-4.5 40t-1.5 40q0 20 1.5 40t4.5 40h134v80H404q12 43 31 82.5t45 75.5q20 0 40-2.5t40-4.5v82q-20 2-40 4.5T480-80ZM170-400h136q-3-20-4.5-40t-1.5-40q0-20 1.5-40t4.5-40H170q-5 20-7.5 40t-2.5 40q0 20 2.5 40t7.5 40Zm34-240h118q9-37 22.5-72.5T376-782q-55 18-99 54.5T204-640Zm172 462q-18-34-31.5-69.5T322-320H204q29 51 73 87.5t99 54.5Zm28-462h152q-12-43-31-82.5T480-798q-26 36-45 75.5T404-640Zm234 0h118q-29-51-73-87.5T584-782q18 34 31.5 69.5T638-640Z"/>
                </svg>
            );

        case 'camera':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M360-320h80v-120h120v-80H440v-120h-80v120H240v80h120v120ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/>
                </svg>
            );
        
        case 'refresh':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                </svg>
            );

        case 'loading':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <g transform="translate(80,50)">
                        <g transform="rotate(0)">
                            <circle cx="0" cy="0" r="6" fillOpacity="1">
                                <animateTransform attributeName="transform" type="scale" begin="-0.875s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.875s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(71.21320343559643,71.21320343559643)">
                        <g transform="rotate(45)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.875">
                                <animateTransform attributeName="transform" type="scale" begin="-0.75s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(50,80)">
                        <g transform="rotate(90)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.75">
                                <animateTransform attributeName="transform" type="scale" begin="-0.625s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.625s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(28.786796564403577,71.21320343559643)">
                        <g transform="rotate(135)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.625">
                                <animateTransform attributeName="transform" type="scale" begin="-0.5s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(20,50.00000000000001)">
                        <g transform="rotate(180)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.5">
                                <animateTransform attributeName="transform" type="scale" begin="-0.375s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.375s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(28.78679656440357,28.786796564403577)">
                        <g transform="rotate(225)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.375">
                                <animateTransform attributeName="transform" type="scale" begin="-0.25s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(49.99999999999999,20)">
                        <g transform="rotate(270)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.25">
                                <animateTransform attributeName="transform" type="scale" begin="-0.125s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.125s"></animate>
                            </circle>
                        </g>
                    </g>
                    <g transform="translate(71.21320343559643,28.78679656440357)">
                        <g transform="rotate(315)">
                            <circle cx="0" cy="0" r="6" fillOpacity="0.125">
                                <animateTransform attributeName="transform" type="scale" begin="0s" values="1.5 1.5;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"></animate>
                            </circle>
                        </g>
                    </g>
                </svg>
            );

        case 'chevron':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -960 960 960">
                    <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z"/>
                </svg>
            );
        
        case 'kofi':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
                </svg>
            );

        default:
            return null;
    }
    
}

export default Icons;
