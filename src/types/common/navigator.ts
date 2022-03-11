export interface XRSystem {
  isSessionSupported: (sessionType: 'immersive-vr') => Promise<boolean>;
}

export interface NavigatorWithXR extends Navigator {
  xr: XRSystem;
}
