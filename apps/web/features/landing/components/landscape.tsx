import { getImageProps } from "next/image";
import valley01 from "../assets/valley/valley-01.webp";
import valley02 from "../assets/valley/valley-02.webp";
import valley03 from "../assets/valley/valley-03.webp";
import valley04 from "../assets/valley/valley-04.webp";
import valley05 from "../assets/valley/valley-05.webp";
import valleyPhone01 from "../assets/valley/valley-phone-01.webp";
import valleyPhone02 from "../assets/valley/valley-phone-02.webp";
import valleyPhone03 from "../assets/valley/valley-phone-03.webp";
import valleyPhone04 from "../assets/valley/valley-phone-04.webp";
import valleyPhone05 from "../assets/valley/valley-phone-05.webp";
import styles from "../styles/landing.module.css";

const tiles = [
	{ wide: valley01, phone: valleyPhone01 },
	{ wide: valley02, phone: valleyPhone02 },
	{ wide: valley03, phone: valleyPhone03 },
	{ wide: valley04, phone: valleyPhone04 },
	{ wide: valley05, phone: valleyPhone05 },
];

const imageProps = (
	src: typeof valley01,
	quality: number,
	sizes: string,
	priority: boolean,
) =>
	getImageProps({
		src,
		alt: "",
		quality,
		sizes,
		priority,
	}).props;

export const Landscape = () => {
	return (
		<div className={styles.landscape} aria-hidden="true">
			{tiles.map(({ wide, phone }, index) => {
				const wideProps = imageProps(
					wide,
					index === 0 ? 41 : 37,
					"100vw",
					index === 0,
				);
				const phoneProps = imageProps(
					phone,
					index === 0 ? 33 : 35,
					"(max-width: 580px) 580px, 100vw",
					index === 0,
				);

				return (
					<picture className={styles.landscapeTile} key={wide.src}>
						<source
							media="(max-width: 700px)"
							srcSet={phoneProps.srcSet}
							sizes={phoneProps.sizes}
						/>
						<source srcSet={wideProps.srcSet} sizes={wideProps.sizes} />
						<img
							className={styles.landscapeImage}
							src={wideProps.src}
							srcSet={wideProps.srcSet}
							sizes={wideProps.sizes}
							width={wide.width}
							height={wide.height}
							alt=""
							loading={index === 0 ? "eager" : "lazy"}
							fetchPriority={index === 0 ? "high" : "low"}
							decoding={index === 0 ? undefined : "async"}
						/>
					</picture>
				);
			})}
		</div>
	);
};
