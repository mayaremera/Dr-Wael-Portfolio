export const protectedMediaProps = {
  draggable: false,
  onContextMenu: (event) => event.preventDefault(),
  onDragStart: (event) => event.preventDefault(),
}

export const protectedVideoProps = {
  ...protectedMediaProps,
  controlsList: 'nodownload noplaybackrate noremoteplayback',
  disablePictureInPicture: true,
  disableRemotePlayback: true,
}

export function blockMediaContext(event) {
  event.preventDefault()
}

export const protectedShellProps = {
  className: 'select-none',
  onContextMenu: blockMediaContext,
  onCopy: (event) => event.preventDefault(),
  onCut: (event) => event.preventDefault(),
}
