<script>
// @ts-nocheck

	import { useChat } from 'ai/svelte'
    import { onMount } from 'svelte';
    import { animate } from '../../stores.js';

    let systemMessage;
    $: systemMessage = []

    let show;
    $: show = false;

    let loaded;
    $: loaded = false;

    let messages, handleSubmit, input;

    let localMessages;
    $: localMessages = []

    let itsEnoughSlices;
    $: itsEnoughSlices = false;


    onMount( async () => {

        const prompt = await data?.user?.system_prompt ?? "You are an AI Assistant develoepd by Astralta Technolgies - a software company that has deployed over 20 projects worldwide implementing AI Technologies for businesses.";
        systemMessage = [{"role": "system", "content": `${prompt}`}];
        itsEnoughSlices = await testLimits()

        loaded = true;
        show = true;


    })

    const testLimits = async () => {
        return data?.user?.messages > data?.user?.message_limit
    }

    $: if (loaded) {
            const chat = useChat({
                initialMessages: systemMessage,
                // onFinish: async () => {
                //     console.log("Started")
                //     await storeMessage(data?.user?.id, localMessages[localMessages.length - 2].content, localMessages[localMessages.length - 1].content)
                //     console.log("Ended")
                // }
                onFinish: async () => {
                    const recordId = data?.user?.id;

                    const response = await fetch('/api/countMsg', {
                        method: 'POST',
                        body: JSON.stringify({ recordId }),
                        headers: {
                            'content-type': 'application/json'
                        }
                    });

                    return response;
                }
            });

    
            ({ messages, handleSubmit, input } = chat);

            // messages.subscribe((value) => localMessages = value)
        }

    async function storeMessage ( user, UserMessage, AIMessage) {
            const response = await fetch('/api/storeMsg', {
                method: 'POST',
                body: JSON.stringify({ user, UserMessage, AIMessage }),
                headers: {
                    'content-type': 'application/json'
                }
            });
    
            const result = await response.json()
        }

        let svgs = {
            web: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" class="w-6 h-6  opacity-40 hover:opacity-100">
                                        <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"/>
                                    </svg>`,
            instagram: `<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 50 50\" class=\"w-6 h-6  opacity-40 hover:opacity-100 opacity-20 hover:opacity-100\"><path d=\"M34,3H16C8.83,3,3,8.83,3,16v18c0,7.17,5.83,13,13,13h18c7.17,0,13-5.83,13-13V16C47,8.83,41.17,3,34,3z M25,36c-6.07,0-11-4.93-11-11s4.93-11,11-11s11,4.93,11,11S31.07,36,25,36z M37,15c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S38.1,15,37,15z\"/><path d=\"M34,25c0,4.96-4.04,9-9,9s-9-4.04-9-9s4.04-9,9-9S34,20.04,34,25z\"/></svg>`,
            pinterest: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.998 511.998" class="w-6 h-6  opacity-40 hover:opacity-100" ><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M405.017,52.467C369.774,18.634,321.001,0,267.684,0C186.24,0,136.148,33.385,108.468,61.39 c-34.114,34.513-53.675,80.34-53.675,125.732c0,56.993,23.839,100.737,63.76,117.011c2.68,1.098,5.377,1.651,8.021,1.651 c8.422,0,15.095-5.511,17.407-14.35c1.348-5.071,4.47-17.582,5.828-23.013c2.906-10.725,0.558-15.884-5.78-23.353 c-11.546-13.662-16.923-29.817-16.923-50.842c0-62.451,46.502-128.823,132.689-128.823c68.386,0,110.866,38.868,110.866,101.434 c0,39.482-8.504,76.046-23.951,102.961c-10.734,18.702-29.609,40.995-58.585,40.995c-12.53,0-23.786-5.147-30.888-14.121 c-6.709-8.483-8.921-19.441-6.222-30.862c3.048-12.904,7.205-26.364,11.228-39.376c7.337-23.766,14.273-46.213,14.273-64.122 c0-30.632-18.832-51.215-46.857-51.215c-35.616,0-63.519,36.174-63.519,82.354c0,22.648,6.019,39.588,8.744,46.092 c-4.487,19.01-31.153,132.03-36.211,153.342c-2.925,12.441-20.543,110.705,8.618,118.54c32.764,8.803,62.051-86.899,65.032-97.713 c2.416-8.795,10.869-42.052,16.049-62.495c15.817,15.235,41.284,25.535,66.064,25.535c46.715,0,88.727-21.022,118.298-59.189 c28.679-37.02,44.474-88.618,44.474-145.282C457.206,127.983,438.182,84.311,405.017,52.467z"></path> </g></svg>`,            
            facebook: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" class="w-6 h-6  opacity-40 hover:opacity-100">    <path d="M12,2C6.477,2,2,6.477,2,12c0,5.013,3.693,9.153,8.505,9.876V14.65H8.031v-2.629h2.474v-1.749 c0-2.896,1.411-4.167,3.818-4.167c1.153,0,1.762,0.085,2.051,0.124v2.294h-1.642c-1.022,0-1.379,0.969-1.379,2.061v1.437h2.995 l-0.406,2.629h-2.588v7.247C18.235,21.236,22,17.062,22,12C22,6.477,17.523,2,12,2z"/></svg>`,
            email: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" class="w-6 h-6  opacity-40 hover:opacity-100">
                                        <path d="M29 4H3a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h26a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.72 2L16 14.77 3.72 6zM30 25a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.23l13.42 9.58a1 1 0 0 0 1.16 0L30 7.23z"/>,
                                    </svg>`,
            amazon: `<svg viewBox="0 0 49 57" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6  opacity-40 hover:opacity-100">
                <path d="M44.667 42C45.6817 42.0356 46.2403 42.0912 47.167 42.5C47.6704 42.9905 47.8732 43.3119 48.167 44C48.3473 44.6461 48.335 45.0857 48.167 46C47.8283 47.5923 47.5285 48.4735 46.667 50C46.1646 51.0024 45.8564 51.0557 45.167 52C44.378 52.7366 43.7705 52.9443 43.167 52C43.0554 51.4103 43.1278 50.9627 43.667 50L44.667 47.5C45.2371 45.8323 45.0398 45.2402 42.667 45.5C41.5989 45.4673 40.7793 45.6174 39.167 46C37.8631 46.424 37.5391 46.8077 37.6787 45.4998C37.7821 45.1218 38.2372 44.2723 39.667 43.4998C40.2824 43.114 40.7702 42.8938 41.667 42.5C42.8352 42.1695 43.4959 42.0747 44.667 42Z"/>
                <path d="M2.17819 44.4998C1.329 43.9969 0.451221 43.8986 0.178191 44.4998C-0.160506 45.2064 -0.0284253 45.648 0.678191 46.4998C3.04779 48.508 4.49142 49.6 7.17819 51.4998C9.98955 53.2555 11.6317 54.1278 14.6782 55.4998C17.7227 56.3059 19.7571 56.547 24.1782 56.4998C28.0562 56.2612 30.2375 55.8799 34.1782 54.4998L40.6782 50.9998C41.2649 50.5369 41.5938 50.2951 42.1782 49.4998C42.5644 48.804 42.4449 48.5098 42.1782 47.9998C41.8596 47.6063 41.6332 47.5068 41.1782 47.4998C40.5 47.5293 40.076 47.626 39.1782 47.9998C35.5887 49.8449 33.476 50.3222 29.6782 50.9998C24.438 51.8258 21.6615 51.9007 17.1782 50.9998C12.9584 49.7624 5.17458 46.3538 4.67819 45.9998C3.63168 45.2535 2.07644 44.5506 2.17819 44.4998Z"/>
                <path d="M19.1074 39.6797C16.8105 39.6797 14.7637 39.2813 12.9668 38.4844C11.1699 37.6719 9.74805 36.4766 8.70117 34.8984C7.66992 33.3047 7.1543 31.3203 7.1543 28.9453C7.1543 26.9453 7.52148 25.2656 8.25586 23.9062C8.99023 22.5469 9.99023 21.4531 11.2559 20.625C12.5215 19.7969 13.959 19.1719 15.5684 18.75C17.1934 18.3281 18.8965 18.0312 20.6777 17.8594C22.7715 17.6406 24.459 17.4375 25.7402 17.25C27.0215 17.0469 27.9512 16.75 28.5293 16.3594C29.1074 15.9687 29.3965 15.3906 29.3965 14.625V14.4844C29.3965 13 28.9277 11.8516 27.9902 11.0391C27.0684 10.2266 25.7559 9.82031 24.0527 9.82031C22.2559 9.82031 20.8262 10.2187 19.7637 11.0156C18.7012 11.7969 17.998 12.7812 17.6543 13.9687L8.41992 13.2188C8.88867 11.0312 9.81055 9.14062 11.1855 7.54688C12.5605 5.9375 14.334 4.70312 16.5059 3.84375C18.6934 2.96875 21.2246 2.53125 24.0996 2.53125C26.0996 2.53125 28.0137 2.76562 29.8418 3.23437C31.6855 3.70312 33.3184 4.42969 34.7402 5.41406C36.1777 6.39844 37.3105 7.66406 38.1387 9.21094C38.9668 10.7422 39.3809 12.5781 39.3809 14.7187V39H29.9121V34.0078H29.6309C29.0527 35.1328 28.2793 36.125 27.3105 36.9844C26.3418 37.8281 25.1777 38.4922 23.8184 38.9766C22.459 39.4453 20.8887 39.6797 19.1074 39.6797ZM21.9668 32.7891C23.4355 32.7891 24.7324 32.5 25.8574 31.9219C26.9824 31.3281 27.8652 30.5312 28.5059 29.5313C29.1465 28.5312 29.4668 27.3984 29.4668 26.1328V22.3125C29.1543 22.5156 28.7246 22.7031 28.1777 22.875C27.6465 23.0312 27.0449 23.1797 26.373 23.3203C25.7012 23.4453 25.0293 23.5625 24.3574 23.6719C23.6855 23.7656 23.0762 23.8516 22.5293 23.9297C21.3574 24.1016 20.334 24.375 19.459 24.75C18.584 25.125 17.9043 25.6328 17.4199 26.2734C16.9355 26.8984 16.6934 27.6797 16.6934 28.6172C16.6934 29.9766 17.1855 31.0156 18.1699 31.7344C19.1699 32.4375 20.4355 32.7891 21.9668 32.7891Z"/>
                </svg>
                `,
            tiktok: `<svg viewBox="0 0 79 90" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6  opacity-40 hover:opacity-100">
                <path d="M55.8438 0C61.3049 17.3502 66.7661 21.2331 78.8438 22.5V37C68.4191 36.9423 63.4556 35.037 55.8438 29V63.5C55.7115 67.2178 55.4831 68.6902 54.8438 70.5C51.8554 78.4884 48.6036 82.0787 40.3438 87C30.1584 90.5774 24.2053 90.7948 12.8438 85.5C5.92662 80.0493 2.85813 76.2891 0.343838 67C-0.481598 59.598 0.05284 55.5347 3.34384 48.5C6.80832 43.0669 9.37196 40.5072 15.3438 37C21.9379 34.2742 25.6728 33.6407 32.3438 34.5V49C28.2516 48.2853 25.7097 48.5826 20.8438 50.5C16.1973 54.73 14.535 57.7171 15.3438 65.5C19.2098 72.6051 22.3433 74.7102 29.3438 75C37.2537 73.4088 39.4369 70.4892 41.3438 63.5V0H55.8438Z"/>
                </svg>
                `,
            linkdIn: `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" class="w-6 h-6  opacity-40 hover:opacity-100"><path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M9,17H6.477v-7H9 V17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2S8.551,8.717,7.694,8.717z M18,17h-2.442v-3.826c0-1.058-0.651-1.302-0.895-1.302s-1.058,0.163-1.058,1.302c0,0.163,0,3.826,0,3.826h-2.523v-7h2.523v0.977 C13.93,10.407,14.581,10,15.802,10C17.023,10,18,10.977,18,13.174V17z"/></svg>`,
        }

    let testlinks = [
        {
            "title": "web",
            "bg_class": "hover:bg-[#2162FA]",
            "alt_color": "#2162FA",
            "url": "https://adrian.astralta.com/"
        },
        {
            "title": "instagram",
            "bg_class": "hover:bg-[#C221FA]",
            "alt_color": "#C221FA",
            "url": "https://instagram.com/adrianmontoya00"
        },
        {
            "title": "email",
            "bg_class": "hover:bg-[#7B21FA]",
            "alt_color": "#7B21FA",
            "url": "mailto:montoya@astralta.com"
        },
        {
            "title": "linkdIn",
            "bg_class": "hover:bg-[#0046FF]",
            "alt_color": "#0046FF",
            "url": "https://www.linkedin.com/in/adrianm1701/"
        },
]

    export let data;
</script>



{#if !itsEnoughSlices}
    <div class="bg-black w-full text-white h-full min-h-screen flex flex-col justify-center items-center relative">
        {#if data?.user?.bg_image_url}
            <div class=" bg-cover w-full h-full z-10 absolute top-0 min-h-screen">
                <img src={data?.user.bg_image_url} alt="bg" class="w-full h-full object-cover">
            </div>
            {/if}
        <div class="w-full h-12 border-b-2 border-opacity-20 border-white fixed top-0 z-40 backdrop-blur-xl justify-between px-4 md:px-6 lg:px-8 xl:px-10 flex-row flex items-center bg-black bg-opacity-20">
            <a href={`https://my.astralta.com/${data?.user?.username}`} class="flex flex-row items-center gap-2">
                <div class="">
                    <img src={data?.user?.cover_url} alt={data?.user?.full_name} class="rounded-full w-8 h-8 object-cover" >
                </div>
                <h1 class="text-2xl font-semibold flex items-center ">
                    {data?.user?.full_name}
                </h1>
            </a>

            <div>
                <a href={`https://my.astralta.com/${data?.user?.username}`} class="{$animate} opacity-50 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </a>
            </div>
        </div>
        <div class="md:w-3/4 w-full mb-36 mt-16 items-start min-h-full z-20">
            {#if loaded}
                <!-- {systemMessage[0].content} -->
                <ul class="w-full rounded-2xl overflow-hidden">
                    {#each $messages as message}
                        {#if message.role == "user"}
                            <li class="bg-black bg-opacity-10 backdrop-blur-lg w-full px-6 py-2 opacity-80">{message.content}</li>
                        {:else}
                            {#if message.role == "assistant"}
                                <li class="{data?.user?.darkMode  ? 'bg-white bg-opacity-10' : 'bg-black bg-opacity-20'} w-full px-6 py-2 backdrop-blur-xl">{message.content}</li>
                            {/if}
                        {/if}
                    {/each}
                </ul>
            {/if}
        </div>
        <form on:submit={handleSubmit} class="fixed bg-transparent lg:bottom-0 pb-6 pt-4 backdrop-blur-2xl bottom-0 w-full flex flex-col px-6 lg:px-20 xl:px-80 items-center gap-2 z-20">
            <!-- Prolly add action pool? -->
            <div class="w-full flex flex-row justify-start items-center gap-3">
                {#each data?.user?.links as l}    
                    <a href={l.url}>
                        <div class="{$animate} {data?.user?.darkMode ? 'bg-white bg-opacity-5 fill-white' : 'bg-black bg-opacity-10 fill-white'}  hover:fill-white rounded-full w-10 h-10 justify-center items-center flex ">
                            {@html svgs[l.title]}
                        </div>
                    </a>
                {/each}
            </div>
            <div class="flex flex-row w-full gap-4">
                <input bind:value={$input} class="w-full h-full bg-transparent rounded-2xl border-2 px-4 py-2 border-white border-opacity-20 text-sm placeholder:text-white placeholder:text-opacity-60" placeholder="Ask anything" />
                <button type="submit" class="{$animate} opacity-80 hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                    
        
                </button>
            </div>
        </form>
    </div>
{:else}
    <div class="bg-black w-full h-full min-h-screen flex justify-center items-center">
        <h1 class="text-white">
            This AI has reached its maximum capacity
        </h1>
    </div>
{/if}
