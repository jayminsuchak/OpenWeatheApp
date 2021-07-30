import React from 'react';
import { render } from '@testing-library/react';
import { ItemTitle } from '../ItemTitle';

describe('test for ItemTitle', () => {
    test('renders without crashing', () => {
        const { baseElement } = render(<ItemTitle title="testTitle" />);
        expect(baseElement).toBeDefined();
    });
})


