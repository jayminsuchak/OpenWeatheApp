import React from 'react';
import { render } from '@testing-library/react';
import { ItemIconTitle } from '../ItemIconTitle';

describe('test for ItemIconTitle', () => {
    test('renders without crashing', () => {
        const { baseElement } = render(<ItemIconTitle imageSource="demoText" title="testTitle" />);
        expect(baseElement).toBeDefined();
    });
})


