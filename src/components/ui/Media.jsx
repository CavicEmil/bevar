import { useState } from "react";

export default function Media(props) {
  // Reset the error state when the media file changes.
  const mediaKey = `${props.type ?? "image"}:${props.src}:${props.srcSet ?? ""}`;

  return <MediaContent key={mediaKey} {...props} />;
}

function MediaContent({
  type = "image",
  src,
  alt = "",
  ratio = "16 / 9",
  fit = type === "video" ? "contain" : "cover",
  position = "center",
  poster,
  srcSet,
  sizes,
  priority = false,
  captions,
  className = "",
}) {
  const [failed, setFailed] = useState(false);

  const unavailable = !src || failed;

  const mediaStyle = {
    objectFit: fit,
    objectPosition: position,
  };

  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-[12px]
        bg-rose-fantasy
        ${className}
      `}
      style={{ aspectRatio: ratio }}
    >
      {unavailable ? (
        <div
          role="img"
          aria-label={
            alt
              ? `${alt}. Media unavailable.`
              : "Media unavailable"
          }
          className="
            absolute inset-0 flex items-center justify-center
            p-4 text-center font-the-one
            text-small text-dark-humor
          "
        >
          {type === "video"
            ? "Video unavailable"
            : "Image unavailable"}
        </div>
      ) : type === "video" ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          preload="none"
          aria-label={alt || "Video"}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full bg-black"
          style={mediaStyle}
        >
          {captions?.src && (
            <track
              kind="captions"
              src={captions.src}
              srcLang={captions.srcLang ?? "en"}
              label={captions.label ?? "English"}
              default
            />
          )}

          Your browser does not support this video.
        </video>
      ) : (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full"
          style={mediaStyle}
        />
      )}
    </div>
  );
}