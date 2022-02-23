<script>
    let avatar, fileinput, encodedImg;
    let response = {
        ok: false,
    };
    const onFileSelected = async (e) => {
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            encodedImg = reader.result;
        };
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            avatar = e.target.result;
        };
    };
    const submitImage = async () => {
        response = await fetch(
            // "http://localhost:3000/cat-image",
            "https://z3ixj2ojoe.execute-api.us-east-2.amazonaws.com/prod/cat-image",
            {
                method: "POST",
                body: JSON.stringify({
                    image: encodedImg
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    };
</script>

<div id="app">
    {#if !response.ok}
        <h3>
            http://localhost:3000/cat-image Drop a cat pic here if you would
            like us to feature it on our cat wall!
        </h3>
        {#if avatar}
            <img class="avatar" src={avatar} alt="d" />
        {:else}
            <img
                class="avatar"
                src="https://cdn0.iconfinder.com/data/icons/animals-87/24/cat-face-512.png"
                alt=""
            />
        {/if}
        <img
            class="upload"
            src="https://static.thenounproject.com/png/625182-200.png"
            alt=""
            on:click={() => {
                fileinput.click();
            }}
        />
        <div
            class="chan"
            on:click={() => {
                fileinput.click();
            }}
        >
            {#if avatar}
                Think you can do better? Go for it!
            {:else}
                Choose ur fav cat pic
            {/if}
        </div>
        <input
            style="display:none"
            type="file"
            accept=".jpg, .jpeg, .png"
            on:change={async (e) => await onFileSelected(e)}
            bind:this={fileinput}
        />
        {#if avatar}
            <button on:click={(e) => submitImage(e)}>Submit</button>
        {/if}
    {:else}
        <h3>We got it, thx!</h3>
    {/if}
</div>

<style>
    #app {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
    }

    button {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 1em;
        font-weight: 100;
        margin-top: 0.5em;
        cursor: pointer;
    }

    .upload {
        display: flex;
        height: 50px;
        width: 50px;
        cursor: pointer;
    }
    .avatar {
        display: flex;
        height: 200px;
        width: 200px;
    }
</style>
