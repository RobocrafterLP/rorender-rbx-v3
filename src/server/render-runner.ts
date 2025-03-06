import {
	mergeImageDataIntoSingleData,
} from 'shared/file/file.utils';
import { render } from 'shared/render/render.main';
import {
	ensureImageLessThanMaxSize,
	getImageDimensions,
	splitImageIntoChunks,
} from 'shared/utils';
import { Settings } from 'shared/settings/settings.model';
import { ProgressUpdateHooks } from 'ui/screens/main';

const httpService = game.GetService('HttpService');

export const runRender = (
	renderSettings: Settings,
	progressHooks: ProgressUpdateHooks
) => {
	try {
		ensureImageLessThanMaxSize(renderSettings);
	} catch (e: any) {
		progressHooks.errorOccured(e);
		return;
	}
	progressHooks.setCurrentStatusText('Rendering Image...');
	progressHooks.setCurrentProgress(0);
	task.wait(0.5);
	let gotimagesSize = true
	render(renderSettings, progressHooks)
		.then((output) => {
			print(typeOf(output), output);
			const imageSize = getImageDimensions(renderSettings);
			progressHooks.setCurrentProgress(0);
			progressHooks.setCurrentStatusText(
				'Sending image size: to RoRender Application'
			);
			if (!gotimagesSize) {
				const response = httpService.PostAsync(
					'http://localhost:8081/render-begin',
					`{"imageSize": {"x": ${imageSize.X}, "y": ${imageSize.Y}}}`
				);
				gotimagesSize = true;
			}
			progressHooks.setCurrentStatusText('Performing Data Accumulation...');
			const merged = mergeImageDataIntoSingleData(output);
			progressHooks.setCurrentProgress(1 / 4);
			progressHooks.setCurrentStatusText(
				'Compressing Data [Run Length Encoding]'
			);
			progressHooks.setCurrentProgress(2 / 4);
			progressHooks.setCurrentStatusText('Compressing Data [Huffman Encoding]');
			progressHooks.setCurrentProgress(3 / 4);
			progressHooks.setCurrentStatusText('Adding Final Encodings...');

			progressHooks.setCurrentProgress(0);
			progressHooks.setCurrentStatusText(
				'Sending Data to RoRender Application'
			);
			print(merged.size())
			let chunksSent = 0;
			const promises: Promise<void>[] = [];
			output.forEach((chunk, idx) => {
				// print(chunk);
				promises.push(
					new Promise<void>((success, failure) => {
						// print('sent ' + tostring(idx), 'size: ' + chunk.size());
						// const [httpSuccess, errorMsg] = pcall(() => {
						// 	httpService.PostAsync(
						// 		'http://localhost:8081/data',
						// 		httpService.JSONEncode(chunk)
						// 	);
						// });
						if (true) {
							chunksSent++;
							progressHooks.setCurrentProgress(chunksSent / output.size());
							success();
						} else {
							failure("errorMsg");
						}
					})
				);
			});
			Promise.all(promises)
				.then((_) => {
					progressHooks.setCurrentStatusText('Render Complete...');
					progressHooks.renderComplete();
				})
				.catch((e) => {
					progressHooks.errorOccured(tostring(e));
				});
		})
		.catch((e) => {
			progressHooks.errorOccured(tostring(e));
		});
};
