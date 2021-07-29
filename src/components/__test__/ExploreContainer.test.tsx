import React from 'react';
import { render } from '@testing-library/react';
import GetWeatherContainer from '../GetWeatherContainer';
import axios from 'axios'

jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue({
    baseURL: 'https://api.openweathermap.org/data/2.5'
  }),
  get: jest.fn(),
}));

describe('WeatherContainer', () => {

  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect");
    mockUseEffect();
    mockUseEffect();

  })

  let useEffect: { mockImplementationOnce: (arg0: (f: any) => any) => void; };


  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => axios.get('/mockWeather'));
  };

  test('renders without crashing', () => {
    const { baseElement } = render(<GetWeatherContainer />);
    expect(baseElement).toBeDefined();
  });
})


