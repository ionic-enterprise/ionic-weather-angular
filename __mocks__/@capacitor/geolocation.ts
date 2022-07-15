class MockGeolocation {
  async getCurrentPosition(): Promise<any> {
    return { coords: { latitude: 0, longitude: 0 } };
  }
}

const Geolocation = new MockGeolocation();

export { Geolocation };
