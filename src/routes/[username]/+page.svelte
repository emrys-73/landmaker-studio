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

    export let data;
</script>



{#if !itsEnoughSlices}
    <div class=" w-full text-white h-full min-h-screen flex flex-col justify-center items-center relative">
        {#if data?.user?.bg_image_url}
            <div class=" bg-cover w-full h-full z-10 absolute top-0 min-h-screen">
                <img src={data?.user.bg_image_url} alt="bg" class="w-full h-full object-cover">
            </div>
            {/if}
        <div class="w-full h-12 border-b-2 border-opacity-20 border-white fixed top-0 z-20 backdrop-blur-xl justify-between px-4 md:px-6 lg:px-8 xl:px-10 flex-row flex items-center bg-black bg-opacity-20">
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
                <ul class="w-full">
                    {#each $messages as message}
                        {#if message.role == "user"}
                            <li class="bg-white bg-opacity-0 w-full px-6 py-2 opacity-60">{message.content}</li>
                        {:else}
                            {#if message.role == "assistant"}
                                <li class="bg-white bg-opacity-5 w-full px-6 py-2 backdrop-blur-md">{message.content}</li>
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
                                {#if l.active}
                                <a href={l.url}>
                                    <div class="{$animate} {l.bg_class} {data?.user?.darkMode ? 'bg-white bg-opacity-5 fill-white' : 'bg-black bg-opacity-10 fill-black'} hover:fill-white rounded-full w-10 h-10 justify-center items-center flex ">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox={l.viewbox} class="w-6 h-6  opacity-40 hover:opacity-100">
                                            {@html l.icon_path}
                                        </svg>
                                        
                                    </div>
                                </a>
                                {/if}
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
