<script>
    import { animate } from "../stores";

</script>


<div class="w-full h-full flex flex-col justify-center items-center min-h-screen">
    <div class="flex flex-row w-full h-full justify-center items-center gap-2">
        <img src="/logo.png" alt="Astralta" class="w-20 h-20 ">
        <h1 class="text-7xl text-white font-bold">
            AI
        </h1>
    </div>

    <form action="?/goToUser" method="POST" class="md:w-3/4 px-6 w-full flex flex-col justify-center items-center gap-4">
        <input type="text" name="username" id="username" placeholder="Type in username" class="{$animate} bg-transparent w-full border-2 border-white border-opacity-20 rounded-full placeholder:text-white placeholder:text-opacity-70 text-white px-6 py-2">
        <button type="submit" class="{$animate} text-black font-bold bg-white hover:bg-[#7EFF6D] hover:text-black px-4 py-2 w-3/4 hover:w-full rounded-full">
            Go
        </button>
    </form>
</div>