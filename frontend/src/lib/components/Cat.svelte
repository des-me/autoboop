<script lang="ts">
	import { getStore, type CatModel, type ClientDimensions, type State } from '$lib/cat-store';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/env';
	import { Cat } from '$lib/graphql/generated-operations';

	let element: HTMLDivElement;
	let isMobile: boolean;
	let timeout: NodeJS.Timeout | undefined;
	let prompts: Record<State['step']['key'], string>;
	const THRESHOLD_MS = 800;

	const [state, dispatch] = getStore();

	function mouseMovedInBox(x: number, y: number) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			mouseHeldStillOverThreshold();
		}, THRESHOLD_MS);
		dispatch({
			type: 'mouseMovedInBox',
			x,
			y
		});
	}

	function mouseHeldStillOverThreshold() {
		if ($state.step.key !== 'promptUserToHoldStill') {
			return;
		}
		dispatch({
			type: 'mouseHeldStillOverThreshold',
			x: $state.step.x,
			y: $state.step.y
		});
		Cat({
			variables: {
				x: $state.step.x,
				y: $state.step.y
			}
		}).subscribe((result) => {
			if (result.data.cat && $state.step.key !== 'promptUserToMoveCursor') {
				const dimensions = getDimensions(result.data.cat, $state.step.x, $state.step.y);
				dispatch({
					type: 'loadedCatImage',
					cat: result.data.cat,
					x: $state.step.x,
					y: $state.step.y,
					dimensions
				});
			}
		});
	}

	function mouseLeftBox() {
		clearTimeout(timeout);
		dispatch({ type: 'mouseLeftBox' });
	}

	function onMouseMove(e: HTMLElementEventMap['mousemove']) {
		const { left, top, width, height } = element.getBoundingClientRect();
		const x = Math.round(((e.clientX - left) / width) * 100);
		const y = Math.round(((e.clientY - top) / height) * 100);
		if (
			$state.step.key !== 'promptUserToMoveCursor' &&
			x === $state.step.x &&
			y === $state.step.y
		) {
			return;
		}
		mouseMovedInBox(x, y);
	}

	function onMouseLeave(e: HTMLElementEventMap['mouseleave']) {
		mouseLeftBox();
	}

	function onTouchStart(e: HTMLElementEventMap['touchstart']) {
		const { left, top, width, height } = element.getBoundingClientRect();
		const x = Math.round(((e.touches[0].clientX - left) / width) * 100);
		const y = Math.round(((e.touches[0].clientY - top) / height) * 100);
		mouseMovedInBox(x, y);
	}

	function getDimensions(cat: CatModel, x: number, y: number): ClientDimensions {
		const { width: containerWidth, height: containerHeight } = element.getBoundingClientRect();
		const mouseX = (x / 100) * containerWidth;
		const mouseY = (y / 100) * containerHeight;

		let imageWidth, imageHeight;
		// image width, height in pixels
		if (containerWidth > containerHeight) {
			// landscape
			imageWidth = containerWidth;
			imageHeight = (cat.height / cat.width) * containerWidth;
		} else {
			// portrait
			imageWidth = (cat.width / cat.height) * containerHeight;
			imageHeight = containerHeight;
		}

		// delta in pixels
		const xDelta = mouseX - (imageWidth * cat.x) / 100;
		const yDelta = mouseY - (imageHeight * cat.y) / 100;

		const dimensions = {
			width: imageWidth,
			height: imageHeight,
			top: yDelta,
			left: xDelta
		};

		return dimensions;
	}

	onMount(() => {
		if (browser) {
			isMobile = 'ontouchstart' in document.documentElement;
			prompts = {
				promptUserToMoveCursor: isMobile ? 'Tap Anywhere' : 'Move your cursor around',
				promptUserToHoldStill: isMobile ? 'Hold still!' : 'Detecting pointer... Hold still!',
				loadingCat: 'Here it comes!',
				showingCat: ''
			};

			if (isMobile) {
				element.addEventListener('touchstart', onTouchStart);
			} else {
				element.addEventListener('mousemove', onMouseMove);
				element.addEventListener('mouseleave', onMouseLeave);
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			if (isMobile) {
				element.removeEventListener('touchstart', onTouchStart);
			} else {
				element.removeEventListener('mousemove', onMouseMove);
				element.removeEventListener('mouseleave', onMouseLeave);
			}
		}
	});
</script>

<div
	class="w-screen h-screen text-6xl overflow-hidden cursor-default relative flex flex-col justify-center items-center text-center"
	bind:this={element}
>
	{prompts ? prompts[$state.step.key] : ''}
	{#if $state.step.key === 'showingCat'}
		<!-- PREVIEW -->
		<div
			class="relative cursor-pointer"
			style={`width: ${$state.step.dimensions.width}px; height: ${$state.step.dimensions.height}px; left: ${$state.step.dimensions.left}px; top: ${$state.step.dimensions.top}px`}
		>
			<img
				class="object-cover w-full h-full"
				src={$state.step.cat.base64}
				alt={$state.step.cat.name}
			/>
		</div>
		<!-- ACTUAL -->
		<div
			class="absolute cursor-pointer"
			style={`width: ${$state.step.dimensions.width}px; height: ${$state.step.dimensions.height}px; left: ${$state.step.dimensions.left}px; top: ${$state.step.dimensions.top}px`}
		>
			<img
				class="object-cover w-full h-full"
				src={`${import.meta.env.VITE_API_BASE_URL}/${$state.step.cat.name}`}
				alt={$state.step.cat.name}
			/>
		</div>
	{/if}
	<div class="text-sm bg-white/70 text-shadow text-black p-1 fixed top-0 left-0">
		You&apos;ve booped {$state.boops} times
	</div>
</div>
