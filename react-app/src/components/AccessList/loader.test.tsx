import { render, waitFor } from '@testing-library/react';
import { AccessStoreState } from 'redux/store/access';
import { AsyncProcessStatus } from 'redux/store/processing';
import Loader, { LoaderProps } from './loader';
import sampleData from '../../test/data/view.test.data.sample.json';
import { Sample } from 'lib/ViewModel';

const sample = (sampleData as unknown) as Sample;
const TIMEOUT = 10000;

describe('AccessList loader component', () => {

    test('The access list loader should invoke the load function when in initial state', async () => {
        const accessState: AccessStoreState = {
            status: AsyncProcessStatus.NONE
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            accessState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const { getByText } = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Access List...');
            expect(messageElement).toBeInTheDocument();
            expect(loadWasCalled).toEqual(true);
        }, {
            timeout: TIMEOUT
        });
    });

    test('The access list loader in PROCESSING state should show the loading indicator but not invoke the loader', async () => {
        const accessState: AccessStoreState = {
            status: AsyncProcessStatus.PROCESSING
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            accessState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const { getByText } = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText('Loading Access List...');
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });

    test('The access list loader in ERROR state should show the error', async () => {
        const accessState: AccessStoreState = {
            status: AsyncProcessStatus.ERROR,
            error: {
                code: '123',
                source: 'testing',
                message: 'A Message'
            }
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            accessState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const { getByText } = render(<Loader {...props} />);
        await waitFor(() => {
            const messageElement = getByText(new RegExp(`${accessState.error.message}`));
            expect(messageElement).toBeInTheDocument();
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });


    test('The access list loader in SUCCESS state should show the access list', async () => {
        const accessState: AccessStoreState = {
            status: AsyncProcessStatus.SUCCESS,
            state: {
                accessList: {
                    admin: [{
                        username: 'foo',
                        realname: 'Foo',
                        gravatarHash: '123'
                    }],
                    read: [{
                        username: 'bar',
                        realname: 'Bar',
                        gravatarHash: '456'
                    }],
                    write: [{
                        username: 'baz',
                        realname: 'Baz',
                        gravatarHash: '789'
                    }]
                }
            }
        }
        let loadWasCalled: boolean = false;
        const props: LoaderProps = {
            accessState,
            sample,
            load: () => {
                loadWasCalled = true;
            }
        };

        const { getByTestId } = render(<Loader {...props} />);
        await waitFor(() => {
            // We really just need to assert that the access list did render.
            const linkElement = getByTestId('accesslist');
            expect(linkElement).toBeInTheDocument();

            // We leave the details of access list rendering to the access list tests
        }, {
            timeout: TIMEOUT
        });

        expect(loadWasCalled).toEqual(false);
    });
});