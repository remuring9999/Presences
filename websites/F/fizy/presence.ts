const presence = new Presence({
		clientId: "633985961604415519",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
	});

presence.on("UpdateData", async () => {
	const player = document.querySelector(
			"#audio-player_html5_api"
		) as HTMLAudioElement,
		playing = player ? (player.paused ? false : true) : false,
		data: { [k: string]: string | number } = {
			largeImageKey:
				"https://cdn.rcd.gg/PreMiD/websites/F/fizy/assets/logo.png",
		},
		songName = document.querySelector(
			"body > div.main-wrapper.ng-scope > ui-view > main > div > media-player > div > div.player > div.player__wrapper > div.player__metadata > div > div.player__media-name.radio__media-name > a"
		),
		artistName = document.querySelector(
			"body > div.main-wrapper.ng-scope > ui-view > main > div > media-player > div > div.player > div.player__wrapper > div.player__metadata > div > div.player__media-artists > a"
		);
	if (player) {
		[data.startTimestamp, data.endTimestamp] = presence.getTimestamps(
			Math.floor(player.currentTime),
			Math.floor(player.duration)
		);
	}

	if (
		songName &&
		songName.textContent !== "" &&
		artistName &&
		artistName.textContent !== ""
	) {
		data.details = songName.textContent;
		data.state = artistName.textContent.trim();
		if (!playing) {
			delete data.startTimestamp;
			delete data.endTimestamp;
		}

		data.smallImageText = playing
			? (await strings).play
			: (await strings).pause;
		playing ? (data.smallImageKey = "play") : (data.smallImageKey = "pause");

		presence.setActivity(data);
	}
});
